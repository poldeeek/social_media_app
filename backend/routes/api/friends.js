require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")

const router = express.Router();

// Friends model
const Friends = require('../../models//Friends');

// Chat model
const Chat = require('../../models/Chat');

// Message model
const Message = require('../../models/Message')

// @route POST api/friends/removeFriend/:id
// @desc Remove user from friends 
// @access Private
router.post('/removeFriend/:id', async (req, res) => {

    await Friends.updateOne({
        user_id: req.params.id
    }, {
        $pull: { friends: req.body._id }
    })

    await Friends.updateOne({
        user_id: req.body._id
    }, {
        $pull: { friends: req.params.id }
    })

    await Chat.findOneAndDelete({
        users: { $all: [req.body._id, req.params.id] }
    }, (err, docs) => {
        if (err) res.status(500).json({ msg: "Deleting chat error." })

        Message.deleteMany({
            chat_id: docs._id
        })
    })

    res.status(200).json("Friend removed.");
})


module.exports = router;
