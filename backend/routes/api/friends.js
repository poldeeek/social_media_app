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
const User = require('../../models/User');

// @route   POST api/friends/addFriend/:id
// @desc    Accpet invitation to friends
// @access  Private
router.post('/addFriend/:id', accessTokenVerify, isUserExistIdParams, isUserExistIdBody, isInvitationExist, (req, res) => {

    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }).then(async result => {

        const chat = await new Chat({
            users: [
                req.params.id,
                req.body._id
            ]
        }).save()
            .then(chat => chat)
            .catch(err => { return res.status(500).json({ error: "Database chat create problem." }) });

        await new Message({
            chat_id: chat._id,
            author_id: req.params.id,
            text: "Cześć. Jesteśmy teraz znajomymi!"
        }).save(async (err, mess) => {
            if (err) return res.status(500).json({ error: 'Database sending message problem.' })

            await Chat.findByIdAndUpdate(chat._id, {
                lastMessage: mess._id
            })
        })

        await Friends.updateOne(
            { user_id: req.params.id },
            { $addToSet: { friends: req.body._id } })
            .catch(err =>
                res.status(500).json({ error: "Database adding friend problem." })
            )

        await Friends.updateOne(
            { user_id: req.body._id },
            { $addToSet: { friends: req.params.id } })
            .catch(err =>
                res.status(500).json({ error: "Database adding friend problem." })
            )
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

            //set notification about added new friend
            res.io.in(`${req.params.id}`).emit('friend-added', req.body._id)
            res.io.in(`${req.body._id}`).emit('friend-added', req.params.id)

            return res.status(200).json({ msg: "Friend added." })
        }).catch(err => {
            res.status(500).json({ error: "Database adding notification problem." })

        })

    }).catch(err => {
        res.status(500).json({ error: "Database invitation accept problem." })

    })

})

// @route POST api/friends/removeFriend/:id
// @desc Remove user from friends 
// @access Private
router.post('/removeFriend/:id', accessTokenVerify, isUserExistIdParams, isUserExistIdBody, async (req, res) => {

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
        return res.status(500).json({ error: "Deleting chat error." })
    })
    //set notification about removed friend
    res.io.in(`${req.params.id}`).emit('friend-removed', req.body._id)
    res.io.in(`${req.body._id}`).emit('friend-removed', req.params.id)

    return res.status(200).json("Friend removed.");
})

// @Route   GET /api/friends/getFriends/profile/:id
// @desc    Getting list of user friends to diplay on profile page
// @access  Private
router.get('/getFriends/profile/:id', accessTokenVerify, (req, res) => {
    Friends.findOne({ user_id: req.params.id })
        .populate({ path: "friends", select: "name surname avatar" })
        .then(result => {
            console.log(result)

            return res.status(200).json(result);
        }).catch(err => res.status(500).json(err))

})

// @Route   GET /api/friends/getFriends/:id?search=search
// @desc    Getting list of friends and their status to firendsList
// @access  Private
router.get('/getFriends/:id', accessTokenVerify, async (req, res) => {
    const { search } = req.query;

    console.log(search)
    let options;

    if (search) {
        const searchTerm = search.split(" ");

        let searchTermRegex = [];

        for (let i = 0; i < searchTerm.length; i++) {
            searchTermRegex[i] = new RegExp(searchTerm[i], 'i')
        }
        console.log("test")
        options = {
            $or: [
                { name: { $in: searchTermRegex } },
                { surname: { $in: searchTermRegex } }
            ]
        }

    }
    console.log(options)

    Friends.findOne({ user_id: req.params.id })
        .populate({
            path: "friends",
            select: "name surname avatar online",
            match: options,
            options: {
                sort: { online: -1, name: 1, surname: 1 },
            }
        })
        .then(result => {
            return res.status(200).json(result)
        }).catch(err => res.status(500).json(err))
})

// @Route   GET /api/friends/getFriend/:id
// @desc    Getting friend info to firendsList
// @access  Private
router.get('/getFriend/:id', accessTokenVerify, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("name surname avatar online")
        .then(result => {
            console.log(result)
            return res.status(200).json(result)
        }).catch(err => res.status(500).json(err))
})



module.exports = router;
