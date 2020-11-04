require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist');
const { isCommentExist } = require('../../middleware/paramsValidations/isCommentExist');

const router = express.Router();

// Chat model
const Message = require("../../models/Message");
const Chat = require('../../models/Chat');


// @route   GET /api/message/getMessages/:chatId?limit=limit&date=lastMessageDate
// @desc    get all messages from chat by chatId
// @access  Private
router.get('/getMessages/:chatId', accessTokenVerify, (req, res) => {
    const { chatId } = req.params;
    const { limit, date } = req.query;

    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    let options;
    // options to search, - date=null when this is first fetch
    if (date) {
        options = {
            chat_id: chatId,
            updated_at: {
                $lt: date
            },
        }
    } else {
        options = {
            chat_id: chatId
        }
    }

    Message
        .find(options)
        .populate({ path: "author_id", select: "name surname avatar" })
        .limit(parseInt(limit))
        .sort({ updated_at: -1 })
        .then(results => {
            res.status(200).json(results)
        }).catch(err => {
            return res.status(500).json({ error: "Database getting messages problem." })
        })
})

// @route   POST /api/message/sendMessage/:id
// @desc    save message in database
// @access  Private
router.post('/sendMessage/:chatId', accessTokenVerify, (req, res) => {
    const { chatId } = req.params;
    const { author_id, text, photo, recipient } = req.body;
    new Message({
        chat_id: chatId,
        author_id,
        text,
        photo
    }).save().then(resp => {


        Chat.findByIdAndUpdate(resp.chat_id, {
            lastMessage: resp._id
        }).then(result => {
            // send
            res.io.in(`${recipient}`).emit('new_message', resp)

            return res.status(200).json(resp);
        })
    }).catch(err => res.status(500).json({ error: "Database sending messages problem." }))
})

// @route   POST /api/message/seeMessages/:id
// @desc    set message status as seen
// @access  private
router.post('/seeMessages/:id', accessTokenVerify, isUserExistIdBody, (req, res) => {
    const chatId = req.params.id;
    const userId = req.body.user_id;
    console.log("ga")
    Message.updateMany({ chat_id: chatId, author_id: { $ne: userId } }, {
        seen: true
    }).then((result) =>
        res.status(200).json({ msg: "Messages set as seen." }))
        .catch(err => res.status(500).json({ msg: "Database see messages problem." }))

})

module.exports = router;