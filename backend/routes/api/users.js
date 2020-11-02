require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

// User model 
const User = require("../../models/User");

// Friends model
const Friends = require('../../models/Friends');
const Invitation = require('../../models/Invitation');
const { isUserExistIdParams } = require('../../middleware/paramsValidations/isUserExist');

// @route   GET api/users/search?q=searchingFraze&p=page&limit=perPage
// @desc    Getting users by id
// @access  Private
router.get('/search', accessTokenVerify, (req, res) => {
    if (req.query.q === '') return res.status(400).json({ msg: "Invalid searching fraze." });

    const search = req.query.q.split(' ');
    const page = req.query.p;
    const perPage = req.query.limit;

    if (!perPage || !Number.isInteger(parseInt(perPage))) return res.status(400).json({ error: "Invalid limit parameter." })
    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." })

    let regex = [];
    for (let i = 0; i < search.length; i++) {
        regex[i] = new RegExp(search[i], 'i');
    }


    User.find({
        $or: [
            { name: { $in: regex } },
            { surname: { $in: regex } }
        ]
    }, 'name surname avatar')
        .limit(parseInt(perPage))
        .skip(parseInt(perPage) * parseInt(page))
        .sort({ surname: 'asc', name: 'asc' })
        .then(results => res.status(200).json(results))
        .catch(err => {
            res.status(500).json({ error: "Database finding users problem." })
        })
})

// @route   GET api/users/:id
// @desc    Getting user by id
// @access  Private
router.get('/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    const id = req.params.id;;
    User.findOne({ _id: id },
        'avatar email name surname city birth createdAt')
        .then(async user => {
            user = JSON.parse(JSON.stringify(user))

            // is my friend ? Did I invite him to friends ? Did he invite me ?
            let friend, meInvited, heInvited;

            // Getting request sender ID
            const accessToken = req.headers.authorization.split(' ');
            const { sub } = jwt.verify(accessToken[1], process.env.ACCESS_TOKEN_SECRET)

            await Friends.countDocuments({ user_id: sub, friends: id }, (err, payload) => {
                if (err) return res.status(500).json({ error: "Database problem" });
                if (payload === 0) friend = false;
                else friend = true;
            })

            // Did I invite him to friends ?
            await Invitation.countDocuments({ user_id: sub, invited_user_id: id }, (err, payload) => {
                if (err) return res.status(500).json({ error: "Database problem" });
                if (payload === 0) meInvited = false;
                else meInvited = true;
            })

            // Did he invite me ?
            await Invitation.countDocuments({ user_id: id, invited_user_id: sub }, (err, payload) => {
                if (err) return res.status(500).json({ error: "Database problem" });
                if (payload === 0) heInvited = false;
                else heInvited = true;
            })

            user.isFriend = friend;
            user.meInvited = meInvited;
            user.heInvited = heInvited;


            return res.status(200).json(user)

        })
        .catch(err => {
            res.status(500).json({ msg: "Database getting information about user problem." });
        });
})


// @route   POST api/users/update/photo/:id
// @desc    Updating user profile photo
// @access  Private
router.post('/update/photo/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    const photoUrl = req.body.photo;
    if (!photoUrl) res.status(400).json({ msg: "Missing photo." })
    User.findByIdAndUpdate(req.params.id, { avatar: photoUrl }, (err, doc) => {
        if (err) { console.log(err); res.status(500).json({ msg: "Database updating photo problem." }) }
        res.status(200).json({ msg: "Photo has been updated." })
    })

})

// @route   POST api/users/update/basic/:id
// @desc    Updating user basic information
// @access  Private
router.post('/update/basic/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    const { name, surname, city } = req.body;

    if (!name || !surname || !city) res.status(400).json({ msg: "Please enter all fields." })
    if (name.length > 30 || surname.length > 30 || city.length > 30) res.status(400).json({ msg: "Max length is 30 marks." })
    User.findByIdAndUpdate(req.params.id, { name: name, surname: surname, city: city }, (err, doc) => {
        if (err) { console.log(err); res.status(500).json({ msg: "Database updating basic informations problem." }) }
        res.status(200).json({ msg: "Informations have been updated." })
    })

})

// @route   POST api/users/update/password/:id
// @desc    Updating user password
// @access  Private
router.post('/update/password/:id', accessTokenVerify, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !oldPassword) return res.status(400).json({ error: "Please enter all fields." })

    if (newPassword.length < 6) res.status(400).json({ error: "Password is too short (min 6 marks)." })


    // Check for existing user
    User.findOne({ _id: req.params.id })
        .then(async user => {
            if (!user) return res.status(404).send({ error: "User does not exist." })

            const compare_password = await bcrypt.compare(oldPassword, user.password)

            if (!compare_password) return res.status(401).send({ error: "Wrong password." })

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await User.findByIdAndUpdate(req.params.id, { password: hashedNewPassword }, (err, doc) => {
                if (err) { res.status(500).json({ msg: "Database updating password problem." }) }
                res.status(200).json({ msg: "Password has been updated." })
            })

        }).catch(err => {
            console.log(err)
            return res.status(500).send({ error: "Database problem." })
        })
})

// @route   POST api/users/update/email/:id
// @desc    Updating user email
// @access  Private
router.post('/update/email/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    const { password, email } = req.body

    if (!password || !email) return res.status(400).json({ error: "Please enter all fields." })

    // Check for existing user
    User.findOne({ _id: req.params.id })
        .then(async user => {
            if (!user) return res.status(404).send({ error: "User does not exist." })

            const compare_password = await bcrypt.compare(password, user.password)

            if (!compare_password) return res.status(401).send({ error: "Wrong password." })

            await User.findByIdAndUpdate(req.params.id, { email: email }, (err, doc) => {
                if (err) { res.status(500).json({ msg: "Database updating e-mail problem." }) }
                res.status(200).json({ msg: "E-mail has been updated." })
            })

        }).catch(err => {
            console.log(err)
            return res.status(500).send({ error: "Database problem." })
        })

})
module.exports = router;