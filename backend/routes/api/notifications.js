const express = require('express');
const { accessTokenVerify } = require('../../middleware/accessTokenVerify');
const { isUserExistIdParams } = require('../../middleware/paramsValidations/isUserExist');

// Invitation model
const Invitation = require('../../models/Invitation');
const Notification = require('../../models/Notification');
const Chat = require('../../models/Chat');

const router = express.Router();

module.exports = router;

// @Route   /api/notifications/getNotificationsStatus/:id
// @desc    get notifications status for user
// @Acess   Private

router.get('/getNotificationsStatus/:id', accessTokenVerify, isUserExistIdParams, async (req, res) => {

    let notifications = {
        invitations: false,
        messages: false,
        bell: false
    }

    await Invitation.find({ invited_user_id: req.params.id, seen: false })
        .then(resp => {
            if (resp.length === 0) notifications.invitations = false;
            else notifications.invitations = true;
        })

    await Chat.find({ users: req.params.id })
    .populate({
        select: "id",
        path: "lastMessage", 
        match: { author_id: { $ne: req.params.id }, seen: false},
    }).then(resp => {
        resp.map(chat => {
            if(chat.lastMessage != null){
                notifications.messages = true
            } 
        })
    })

    res.status(200).json(notifications)
})

// @Route   GET /api/notifications/getBells/:id?date=lastBellDate&limit=limit
// @desc    get bell notifications for user
// @Acess   Private

router.get('/getBells/:id', accessTokenVerify, isUserExistIdParams, async (req, res) => {
    const { date, limit } = req.query;

    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    let options;
    // options to search, - date=null when this is first fetch
    if (date) {
        options = {
            user_id: req.params.id,
            updated_at: {
                $lt: date
            },
        }
    } else {
        options = {
            user_id: req.params.id
        }
    }

    Notification.find(options)
        .limit(parseInt(limit))
        .populate({ path: "who_id", select: "name surname avatar" })
        .sort({ updated_at: -1 })
        .then(resp => {
            res.status(200).json(resp)
        })
        .catch(err => res.status(500).json({ error: "Database problem. Finding notifications." }))
})

// @Route   POST /api/notifications/seeAllBells/:id
// @desc    check all bell notifications as seen
// @access  Private
router.post('/seeAllBells/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    Invitation.updateMany({ invited_user_id: req.params.id }, { seen: true })
        .then(async results => {

            res.status(200).json({ msg: "Bells updated." });
        }).catch(err => {
            res.status(500).json({ error: "Database problem. Finding notifications." });
        })
})