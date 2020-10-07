const express = require('express');
const { isUserExistIdParams } = require('../../middleware/paramsValidations/isUserExist');

// Invitation model
const Invitation = require('../../models/Invitation');
const Notification = require('../../models/Notification');

const router = express.Router();

module.exports = router;

// @Route   /api/notifications/getNotificationsStatus/:id
// @desc    get notifications status for user
// @Acess   Private

router.get('/getNotificationsStatus/:id', isUserExistIdParams, async (req, res) => {

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

    res.status(200).json(notifications)
})

// @Route   GET /api/notifications/getBells/:id
// @desc    get bell notifications for user
// @Acess   Private

router.get('/getBells/:id', isUserExistIdParams, async (req, res) => {

    Notification.find({ user_id: req.params.id })
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
router.post('/seeAllBells/:id', isUserExistIdParams, (req, res) => {
    Invitation.updateMany({ invited_user_id: req.params.id }, { seen: true })
        .then(async results => {

            res.status(200).json({ msg: "Bells updated." });
        }).catch(err => {
            res.status(500).json({ error: "Database problem. Finding notifications." });
        })
})