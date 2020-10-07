require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist');
const { isCommentExist } = require('../../middleware/paramsValidations/isCommentExist');

const router = express.Router();

// Comment model
const Comment = require('../../models/Comment');

// Notification model
const Notification = require('../../models/Notification');

// @route   POST api/comments/addComment/:id
// @desc    Add comment
// @access  Private
router.post('/addComment/:id', isPostExist, isUserExistIdBody, (req, res) => {
    if (!req.body.text || req.body.text === '') res.status(400).json({ error: "Missing text input." });

    new Comment({
        author_id: req.body.author_id,
        post_id: req.params.id,
        text: req.body.text.trim()
    }).save().then(result => {

        Notification.findOneAndUpdate({
            object_id: req.params.id,
            who_id: req.body.author_id,
            user_id: req.body.user_id,
            type: req.body.type
        }, {
            object_id: req.params.id,
            who_id: req.body.author_id,
            user_id: req.body.user_id,
            type: req.body.type,
            seen: false
        }, {
            upsert: true,
            useFindAndModify: false
        }).then(resp => {
            // Send notification to user about new invitation
            res.io.in(`${req.body.user_id}`).emit('bell', 'New comment.')

            return res.status(200).json({ msg: "Comment added.", comment: result })
        })
    }).catch(err => res.status(500).json({ msg: "Adding comment failed. Database problem.", err }))
})

// @route   GET api/comments/:id?page=page&limit=limit
// @desc    Get comments from post :id
// @access  Private
router.get('/:id', isPostExist, (req, res) => {

    const perPage = req.query.limit;
    const page = req.query.page;

    if (!perPage || !Number.isInteger(parseInt(perPage))) return res.status(400).json({ error: "Invalid limit parameter." })
    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." })

    Comment.find({ post_id: req.params.id })
        .populate({ path: "author_id", select: "name surname avatar" })
        .skip(parseInt(perPage) * parseInt(page))
        .sort({ created_at: -1 })
        .limit(parseInt(perPage)).then(async results => {
            res.status(200).json(results);
        }).catch(err => {
            res.status(500).json({ error: "Database problem. Finding comments." });
        })
})

// @Route   api/comments/likeComment/:id
// @desc    like the comment
// @access  Private
router.post('/like/:id', isUserExistIdBody, isCommentExist, (req, res) => {

    // check if comment is already liked
    Comment.findOne(
        { _id: req.params.id }
    ).then(result => {
        if (result.likes.includes(req.body.user_id)) return res.status(400).json({ msg: "Comment already liked." })
        Comment.updateOne(
            { _id: req.params.id },
            { $addToSet: { likes: req.body.user_id } })
            .then(resp => {

                Notification.findOneAndUpdate({
                    object_id: req.params.id,
                    who_id: req.body.user_id,
                    user_id: req.body.comment_author,
                    type: req.body.type
                }, {
                    object_id: req.params.id,
                    who_id: req.body.user_id,
                    user_id: req.body.comment_author,
                    type: req.body.type,
                    seen: false
                }, {
                    upsert: true,
                    useFindAndModify: false
                }).then(resp => {
                    // Send notification to user about new invitation
                    res.io.in(`${req.body.user_id._id}`).emit('bell', 'New like the comment.')
                    return res.status(200).json({ msg: "Comment liked." });
                })



            }).catch(err => {
                return res.status(500).json({ error: "Database like comment problem." })
            })
    }).catch(err => {
        res.status(500).json({ error: "Database like comment problem1." })
    })
})

// @Route   api/comments/likeComment/:id
// @desc    like the comment
// @access  Private
router.post('/unlike/:id', isUserExistIdBody, isCommentExist, (req, res) => {

    Comment.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.user_id } })
        .then(resp => {
            return res.status(200).json({ msg: "Comment unliked." });
        }).catch(err => {
            return res.status(500).json({ error: "Database unlike comment problem." })
        })

})


module.exports = router;
