require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify");
const { find } = require('../../models/Invitation');

// User model 
const Invitation = require("../../models/Invitation");

// User model 
const User = require("../../models/User");

// Friends model
const Friends = require('../../models//Friends');

// Chat model 
const Chat = require('../../models/Chat');

const router = express.Router();


// @route   POST api/invitations/sendInvitation/:id
// @desc    Send invitation to user
// @access  Private
router.post('/sendInvitation/:id', (req, res) => {

    const invitation = new Invitation({
        user_id: req.body._id,
        invited_user_id: req.params.id
    })

    invitation.save()
        .then(inv => {

            // Send notification to user about new invitation
            res.io.in(`${req.params.id}`).emit('invitation', 'New invite to friends.')

            res.status(200).json({ msg: "Invitation sent." });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Sending invitations went wrong." })
        })
})

// @route   POST api/invitations/acceptInvitation/:id
// @desc    Accpet invitation to friends
// @access  Private
router.post('/acceptInvitation/:id', (req, res) => {

    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }, async (err) => {
        if (err) res.status(500).json({ msg: "Database problem." })

        await new Chat({
            users: [
                req.params.id,
                req.body._id
            ]
        }).save(err => {
            if (err) res.status(500).json({ msg: "Database problem." })
        });

        await Friends.updateOne(
            { user_id: req.params.id },
            { $addToSet: { friends: req.body._id } }, (err, docs) => {
                if (err) res.status(500).json({ msg: "Database problem." });
            }
        )

        await Friends.updateOne(
            { user_id: req.body._id },
            { $addToSet: { friends: req.params.id } }, (err, docs) => {
                if (err) res.status(500).json({ msg: "Database problem." });
            }
        )


        // Send notification to user about new invitation
        res.io.in(`${req.params.id}`).emit('notification', 'New friend.')

        res.status(200).json({ msg: "Friend added." })

    })
})

// @route   POST api/invitations/rejectInvitation/:id
// @desc    Reject invitation to friends
// @access  Private
router.delete('/rejectInvitation/:id', (req, res) => {

    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }, async (err) => {
        if (err) res.status(500).json({ msg: "Database problem." })

        res.status(200).json({ msg: "Invitation reject." })
    })
})

// @route   POST api/invitations/cancelInvitation/:id
// @desc    Cancel invitation to friends
// @access  Private
router.delete('/cancelInvitation/:id', (req, res) => {
    console.log(req.body)

    Invitation.deleteOne({
        user_id: req.body._id,
        invited_user_id: req.params.id
    }, async (err) => {
        if (err) res.status(500).json({ msg: "Database problem." })

        res.status(200).json({ msg: "Invitation canceled." })
    })
})

// @route GET api/invitations/getInvitations/:id
// @desc Get user invitations 
// @access Private
router.get('/getInvitations/:id', (req, res) => {

    const perPage = req.body.perPage;
    const page = req.body.page;

    Invitation.find({ user_id: req.params.id })
        .limit(parseInt(perPage))
        .skip(parseInt(perPage) * parseInt(page))
        .sort({ createdAt: -1 })
        .then(async results => {

            // Parse array to JSON object
            let results2 = JSON.parse(JSON.stringify(results))


            // getting info about users
            const array = await results.map(user => user.invited_user_id)
            const users = await User.find({
                _id: { $in: array }
            }, 'name surname avatar', (err, usersArray) => {
                if (err) res.status(500).json(err)
                return usersArray;
            })

            // Parse array to JSON object
            let users2 = JSON.parse(JSON.stringify(users))

            const finalData = [];

            results2.forEach(result => {
                users2.forEach(user => {
                    if (result.invited_user_id == user._id) {
                        result.invited_user_id = user
                        finalData.push(result)
                    }
                })
            })

            console.log(results)
            res.status(200).json(finalData);
        }).catch(err => {
            console.log(err)
            res.status(500).json({ err });
        })


})

module.exports = router;