require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify");
const { isInvitationExist } = require('../../middleware/paramsValidations/isInvitationExist');
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');

// User model 
const Invitation = require("../../models/Invitation");

const router = express.Router();


// @route   POST api/invitations/sendInvitation/:id
// @desc    Send invitation to user
// @access  Private
router.post('/sendInvitation/:id', accessTokenVerify, isUserExistIdParams, isUserExistIdBody, (req, res) => {

    const invitation = new Invitation({
        user_id: req.body._id,
        invited_user_id: req.params.id
    })

    invitation.save()
        .then(inv => {

            // Send notification to user about new invitation
            res.io.in(`${req.params.id}`).emit('invitation', 'New invite to friends.')

            return res.status(200).json({ msg: "Invitation sent." });
        }).catch(err => {
            res.status(500).json({ error: "Sending invitations went wrong." })
        })
})

// @route   POST api/invitations/rejectInvitation/:id
// @desc    Reject invitation to friends
// @access  Private
router.post('/rejectInvitation/:id', accessTokenVerify, isUserExistIdParams, isUserExistIdBody, isInvitationExist, (req, res) => {

    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }).then(result => {
        res.status(200).json({ msg: "Invitation reject." })
    }).catch(err => {
        res.status(500).json({ error: "Database problem. Deleting invitation" })
    })
})

// @route   POST api/invitations/cancelInvitation/:id
// @desc    Cancel invitation to friends
// @access  Private
router.post('/cancelInvitation/:id', accessTokenVerify, isUserExistIdParams, isUserExistIdBody, isInvitationExist, (req, res) => {
    Invitation.deleteOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }).then(result => {
        res.status(200).json({ msg: "Invitation canceled." })
    }).catch(err => {
        res.status(500).json({ error: "Databace problem. Deleting invitation." })
    })
})

// @route GET api/invitations/getInvitations/:id?page=page&limit=limit
// @desc Get user invitations 
// @access Private
router.get('/getInvitations/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {

    const perPage = req.query.limit;
    const page = req.query.page;

    if (!perPage || !Number.isInteger(parseInt(perPage))) return res.status(400).json({ error: "Invalid limit parameter." })
    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." })

    Invitation.find({ invited_user_id: req.params.id })
        .populate({ path: 'user_id', select: 'name surname avatar' })
        .skip(parseInt(perPage) * parseInt(page))
        .sort({ created_at: -1 })
        .limit(parseInt(perPage))
        .then(async results => {
            res.status(200).json(results);
        }).catch(err => {
            res.status(500).json({ error: "Database problem. Finding invitations." });
        })
})

// @Route   /api/invitations/seeAllInvitations/:id
// @desc    check all invitations as seen
// @access  Private
router.post('/seeAllInvitations/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {
    Invitation.updateMany({ invited_user_id: req.params.id }, { seen: true })
        .then(async results => {

            res.status(200).json({ msg: "Invitations updated." });
        }).catch(err => {
            res.status(500).json({ error: "Database problem. Finding invitations." });
        })
})
module.exports = router;

