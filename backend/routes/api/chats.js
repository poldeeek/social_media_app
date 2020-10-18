require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist');
const { isCommentExist } = require('../../middleware/paramsValidations/isCommentExist');

const router = express.Router();

// Chat model
const Chat = require("../../models/Chat");


// @route   /api/chats/getChatList/:id
// @desc    get all chats by user id
// @access  private
router.get('/getChatList/:id', (req, res) => {

    Chat.find({
        users: req.params.id
    })
        .populate({ path: "users", select: "name surname avatar online" })
        .populate({ path: "lastMessage", select: "text author_id seen photo" })
        .sort({ updated_at: -1 })
        .then(resp => {
            let results = JSON.parse(JSON.stringify(resp))

            results.forEach(chat => {
                const member = chat.users.find(el => el._id != req.params.id);
                chat.member = { ...member };
                delete chat.users;
            });

            return res.status(200).json(results)
        })
})

// @route   /api/chats/getChat/:id&user_id=user_id
// @desc    get chat between two users
// @access  private
router.get('/getChat/:id', isUserExistIdParams, (req, res) => {

    Chat.findOne({
        users: { $all: [req.query.user_id, req.params.id] }
    })
        .populate({ path: "users", select: "name surname avatar online" })
        .populate({ path: "lastMessage", select: "text author_id seen photo" })
        .then(resp => {
            let result = JSON.parse(JSON.stringify(resp))


            const member = result.users.find(el => el._id != req.query.user_id);
            result.member = { ...member };
            delete result.users;


            return res.status(200).json(result)
        }).catch(err => {
            return res.status(500).json({ error: "Database chat finding error." })
        })
})


module.exports = router;