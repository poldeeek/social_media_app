require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify");
const { isUserExistIdParams, isUserExistIdBody } = require('../../middleware/paramsValidations/isUserExist');
const { isPostExist } = require('../../middleware/paramsValidations/isPostExist')
const router = express.Router();

// Friends model 
const Friends = require('../../models/Friends');

// Post model 
const Post = require("../../models/Post");
const Notification = require('../../models/Notification');

// @route   POST api/posts/addPost/:id
// @desc    Add new post
// @access  Private
router.post('/addPost/:id', isUserExistIdParams, (req, res) => {

    if (!req.body.text) return res.status(400).json({ error: "Text field is empty." })

    const newPost = new Post({
        author_id: req.params.id,
        text: req.body.text,
        photo: req.body.photo,
        likes: []
    });

    newPost.save().then(resp => {
        res.status(200).json({
            msg: "Post added!", post: resp
        })
    }).catch(err => {
        res.status(500).json({ error: "Database problem." })
    })
})

// @route   GET api/posts/getPosts/:id?limit=limit&page=page
// @desc    Get mine and friends posts
// @access  Private
router.get('/getPosts/:id', isUserExistIdParams, async (req, res) => {
    const { id } = req.params;
    const { page, limit } = req.query;
    let friendsArray;

    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." });
    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    await Friends.find({ user_id: id })
        .select('friends -_id')
        .then((result) =>
            friendsArray = JSON.parse(JSON.stringify(result[0].friends))
        )

    // adding current user id to array (getting current user and his friends posts)
    friendsArray.push(id);

    Post.find({ author_id: { $in: friendsArray } })
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .sort({ created_at: -1 })
        .select('_id author_id likes photo text created_at')
        .populate({ path: 'author_id', select: 'surname name avatar' })
        .then(result => {
            res.status(200).json(result);
        }).catch(err => res.status(500).json({ error: "Database finding posts error." }))
})

// @route   GET api/posts/getPosts/profile/:id?limit=limit&page=page
// @desc    Get mine and friends posts
// @access  Private
router.get('/getPosts/profile/:id', isUserExistIdParams, async (req, res) => {
    const { id } = req.params;
    const { page, limit } = req.query;

    if (!page || !Number.isInteger(parseInt(page))) return res.status(400).json({ error: "Invalid page parameter." });
    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    Post.find({ author_id: id })
        .skip(parseInt(limit) * parseInt(page))
        .limit(parseInt(limit))
        .sort({ created_at: -1 })
        .select('_id author_id likes photo text created_at')
        .populate({ path: 'author_id', select: 'surname name avatar' })
        .then(result => {
            res.status(200).json(result);
        }).catch(err => res.status(500).json({ error: "Database finding posts error." }))
})

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', isUserExistIdBody, isPostExist, (req, res) => {

    Post.updateOne(
        { _id: req.params.id },
        { $addToSet: { likes: req.body.who_id } })
        .then(resp => {

            Notification.findOneAndUpdate({
                object_id: req.params.id,
                who_id: req.body.who_id,
                user_id: req.body.user_id._id,
                type: req.body.type
            }, {
                object_id: req.params.id,
                who_id: req.body.who_id,
                user_id: req.body.user_id._id,
                type: req.body.type,
                seen: false
            }, {
                upsert: true,
                useFindAndModify: false
            }).then(resp => {

                // Send notification to user about new invitation
                res.io.in(`${req.body.user_id._id}`).emit('bell', 'New like the post.')

                return res.status(200).json({ msg: "Post liked." });
            }).catch(err => {
                return res.status(500).json({ error: "Database unlike post problem." })
            })

        }).catch(err => {
            return res.status(500).json({ error: "Database unlike post problem." })
        })
})

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', isUserExistIdBody, isPostExist, (req, res) => {

    Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body._id } })
        .then(resp => {
            res.status(200).json({ msg: "Post unliked." })
        }).catch(err => {
            return res.status(500).json({ error: "Database unlike post problem." })
        })

})
module.exports = router;
