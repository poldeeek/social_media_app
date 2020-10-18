require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist');
const { isCommentExist } = require('../../middleware/paramsValidations/isCommentExist');

const router = express.Router();

// Chat model
const Message = require("../../models/Message");
const { isValidObjectId } = require('mongoose');


// @route   GET /api/message/getMessages/:chatId?limit=limit&date=lastMessageDate
// @desc    get all messages from chat by chatId
// @access  Private
router.get('/getMessages/:chatId', (req, res) => {
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
router.post('/sendMessage/:chatId', (req, res) => {
    const { chatId } = req.params;
    const { author_id, text, photo, recipient } = req.body;
    new Message({
        chat_id: chatId,
        author_id,
        text,
        photo
    }).save().then(resp => {

        // send
        res.io.in(`${recipient}`).emit('new_message', resp)

        res.status(200).json(resp);
    }).catch(err => res.status(500).json({ error: "Database sending messages problem." }))
})

module.exports = router;