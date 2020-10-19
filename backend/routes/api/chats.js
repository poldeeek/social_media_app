require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist');
const { isCommentExist } = require('../../middleware/paramsValidations/isCommentExist');

const router = express.Router();

// Chat model
const Chat = require("../../models/Chat");
const Friends = require("../../models/Friends");
const User = require('../../models/User');

// @route   /api/chats/getChats/:id?limit=limit&page=page
// @desc    get all chats by user id
// @access  private
router.get('/getChats/:id', (req, res) => {
    const { limit, page, search } = req.query;

    if (search && search !== "") return res.status(400).json({ error: "Invalid search parameter." })
    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." })
    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." })

    Chat.find({
        users: req.params.id
    })
        .populate({
            path: "users", select: "name surname avatar online"
        })
        .populate({
            path: "lastMessage", select: "text author_id seen photo"
        })
        .limit(parseInt(limit))
        .skip(parseInt(limit) * parseInt(page))
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

// @route   GET /api/chats/searchChats/:id?search=search&limit=limit&page=page
// @desc    get all chats by user id
// @access  private
router.get('/searchChats/:id', async (req, res) => {
    const { limit, page, search } = req.query;

    if (!search || search === "") return res.status(400).json({ error: "Invalid search parameter." })
    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." })

    const searchTerm = search.split(" ");

    let searchTermRegex = [];
    for (let i = 0; i < searchTerm.length; i++) {
        searchTermRegex[i] = new RegExp(searchTerm[i], 'i');
    }


    const friends = await Friends.findOne({ user_id: req.params.id }).then(resp => resp.friends)
    const usersIdArray = await User.find({
        _id: { $in: friends },
        $or: [
            { name: { $in: searchTermRegex } },
            { surname: { $in: searchTermRegex } }
        ]
    })
        .select("_id")
        .limit(parseInt(limit))
        .skip(parseInt(limit) * parseInt(page))
        .sort({ surname: 'asc', name: 'asc' })
        .then(result => {
            const usersId = result.map(user => {
                return user._id;
            })
            return usersId;
        })

    Chat.find({
        $or: [
            {
                "users.1": req.params.id,
                "users.0": { $in: usersIdArray }
            }, {
                "users.0": req.params.id,
                "users.1": { $in: usersIdArray }
            }]
    })
        .populate({
            path: "users", select: "name surname avatar online"
        })
        .populate({
            path: "lastMessage", select: "text author_id seen photo"
        })
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