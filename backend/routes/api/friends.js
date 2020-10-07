require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isInvitationExist } = require('../../middleware/paramsValidations/isInvitationExist');

const router = express.Router();

// Friends model
const Friends = require('../../models/Friends');

// Invitation model
const Invitation = require('../../models/Invitation');

// Chat model
const Chat = require('../../models/Chat');

// Message model
const Message = require('../../models/Message');
const Notification = require('../../models/Notification');

// @route   POST api/friends/addFriend/:id
// @desc    Accpet invitation to friends
// @access  Private
router.post('/addFriend/:id', isUserExistIdParams, isUserExistIdBody, isInvitationExist, (req, res) => {

    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }).then(async result => {

        await new Chat({
            users: [
                req.params.id,
                req.body._id
            ]
        }).save().catch(err => { return res.status(500).json({ error: "Database problem." }) });

        await Friends.updateOne(
            { user_id: req.params.id },
            { $addToSet: { friends: req.body._id } })
            .catch(err =>
                res.status(500).json({ error: "Database problem." })
            )

        await Friends.updateOne(
            { user_id: req.body._id },
            { $addToSet: { friends: req.params.id } })
            .catch(err =>
                res.status(500).json({ error: "Database problem." })
            )
        console.log(req.body)
        Notification.findOneAndUpdate({
            who_id: req.body._id,
            user_id: req.params.id,
            type: req.body.type
        }, {
            who_id: req.body._id,
            user_id: req.params.id,
            type: req.body.type,
            seen: false
        }, {
            upsert: true,
            useFindAndModify: false
        }).then(resp => {
            // Send notification to user about new invitation
            res.io.in(`${req.params.id}`).emit('bell', 'New friend.')

            return res.status(200).json({ msg: "Friend added." })
        }).catch(err => {
            res.status(500).json({ error: "Database problem." })

        })

    }).catch(err => {
        res.status(500).json({ error: "Database problem." })

    })

})

// @route POST api/friends/removeFriend/:id
// @desc Remove user from friends 
// @access Private
router.post('/removeFriend/:id', isUserExistIdParams, isUserExistIdBody, async (req, res) => {

    await Friends.updateOne({
        user_id: req.params.id
    }, {
        $pull: { friends: req.body._id }
    }).catch(err =>
        res.status(500).json({ error: "Database problem." })
    )

    await Friends.updateOne({
        user_id: req.body._id
    }, {
        $pull: { friends: req.params.id }
    }).catch(err =>
        res.status(500).json({ error: "Database problem." })
    )

    await Chat.findOneAndDelete({
        users: { $all: [req.body._id, req.params.id] }
    }).then(docs => {
        Message.deleteMany({
            chat_id: docs._id
        })
    }).catch(err => {
        res.status(500).json({ error: "Deleting chat error." })
    })
    return res.status(200).json("Friend removed.");
})

// @Route   GET /api/friends/getFriends/profile/:id
// @desc    Getting list of user friends to diplay on profile page
// @access  Private
router.get('/getFriends/profile/:id', (req, res) => {
    Friends.findOne({ user_id: req.params.id })
        .populate({ path: "friends", select: "name surname avatar" })
        .then(result => {
            return res.status(200).json(result);
        }).catch(err => res.status(500).json(err))

})

// @Route   GET /api/friends/getFriends/:id
// @desc    Getting list of friends and their status to firendsList
// @access  Private
router.get('/getFriends/:id', (req, res) => {
    Friends.findOne({ user_id: req.params.id })
        .populate({ path: "friends", select: "name surname avatar online" })
        .then(result => {
            return res.status(200).json(result)
        }).catch(err => res.status(500).json(err))
})

module.exports = router;
