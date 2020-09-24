require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const jwt = require("jsonwebtoken");

const router = express.Router();

// User model 
const User = require("../../models/User");

// Friends model
const Friends = require('../../models/Friends');
const Invitation = require('../../models/Invitation');

// @route   GET api/users/search?q=searchingFraze&p=page&limit=perPage
// @desc    Getting users by id
// @access  Private
router.get('/search', accessTokenVerify, (req, res) => {
    const search = req.query.q.split(' ');
    const page = req.query.p;
    const perPage = req.query.limit;

    console.log(page, perPage)

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
            console.log(err)
            res.status(500).json(err)
        })
})

// @route   GET api/users/:id
// @desc    Getting user by id
// @access  Private
router.get('/:id', accessTokenVerify, (req, res) => {
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
                if (err) res.status(500).json({ msg: "Database problem", err });
                if (payload === 0) friend = false;
                else friend = true;
            })

            // Did I invite him to friends ?
            await Invitation.countDocuments({ user_id: sub, invited_user_id: id }, (err, payload) => {
                if (err) res.status(500).json({ msg: "Database problem", err });
                if (payload === 0) meInvited = false;
                else meInvited = true;
            })

            // Did he invite me ?
            await Invitation.countDocuments({ user_id: id, invited_user_id: sub }, (err, payload) => {
                if (err) res.status(500).json({ msg: "Database problem", err });
                if (payload === 0) heInvited = false;
                else heInvited = true;
            })

            user.isFriend = friend;
            user.meInvited = meInvited;
            user.heInvited = heInvited;


            res.status(200).json(user)

        })
        .catch(err => {
            res.status(404).json({ msg: "User does not exist." });
        });
})


module.exports = router;