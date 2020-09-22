require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")

// User model 
const Invitations = require("../../models/Invitations");

// User model 
const User = require("../../models/User");

const router = express.Router();


// @route   POST api/auth/invitations/sendInvitation/:id
// @desc    Send invitation to user
// @access  Private
router.post('/sendInvitation/:id', (req, res) => {

    Invitations.updateOne({ user_id: req.params.id }, { $push: { invitations: { _id: req.body._id } } })
        .then(inv => {

            // Sending notification about new invitation
            User.findOne({ _id: req.body._id }, 'avatar name surname').then(user => {

                console.log('test')
                res.io.in(`${req.params.id}`).emit('invite', JSON.stringify(user))
            });

            res.status(200).json({ msg: "Invitation sent." });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "Sending invitations went wrong." })
        })
})


module.exports = router;