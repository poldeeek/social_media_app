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
router.post('/addPost/:id', accessTokenVerify, isUserExistIdParams, (req, res) => {

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

// @route   GET api/posts/getPosts/:id?limit=limit&date=lastPostdate
// @desc    Get mine and friends posts
// @access  Private
router.get('/getPosts/:id', accessTokenVerify, isUserExistIdParams, async (req, res) => {

    const { id } = req.params;
    const { date, limit } = req.query;
    let friendsArray;

    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    await Friends.find({ user_id: id })
        .select('friends -_id')
        .then((result) =>
            friendsArray = JSON.parse(JSON.stringify(result[0].friends))
        )

    // adding current user id to array (getting current user and his friends posts)
    friendsArray.push(id);

    let options;
    // options to search, - date=null when this is first fetch
    if (date) {
        options = {
            author_id: { $in: friendsArray },
            created_at: {
                $lt: date
            },
        }
    } else {
        options = {
            author_id: { $in: friendsArray },
        }
    }

    Post.find(options)
        .limit(parseInt(limit))
        .sort({ created_at: -1 })
        .select('_id author_id likes photo text created_at')
        .populate({ path: 'author_id', select: 'surname name avatar' })
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            return res.status(500).json({ error: "Database finding posts error." })
        })

})

// @route   GET api/posts/getPosts/profile/:id?limit=limit&date=lastPostdate
// @desc    Get mine and friends posts
// @access  Private
router.get('/getPosts/profile/:id', accessTokenVerify, isUserExistIdParams, async (req, res) => {
    const { id } = req.params;
    const { date, limit } = req.query;

    if (!limit || !Number.isInteger(parseInt(limit))) return res.status(400).json({ error: "Invalid limit parameter." });

    let options;
    // options to search, - date=null when this is first fetch
    if (date) {
        options = {
            author_id: id,
            created_at: {
                $lt: date
            },
        }
    } else {
        options = {
            author_id: id,
        }
    }

    Post.find(options)
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
router.post('/like/:id', accessTokenVerify, isUserExistIdBody, isPostExist, (req, res) => {

    Post.updateOne(
        { _id: req.params.id },
        { $addToSet: { likes: req.body.who_id } })
        .then(resp => {

            Notification.findOneAndUpdate({
                object_id: req.params.id,
                who_id: req.body.who_id,
                user_id: req.body.user_id,
                type: req.body.type
            }, {
                object_id: req.params.id,
                who_id: req.body.who_id,
                user_id: req.body.user_id,
                type: req.body.type,
                seen: false
            }, {
                upsert: true,
                useFindAndModify: false
            }).then(resp => {

                // Send notification to user about new invitation
                res.io.in(`${req.body.user_id}`).emit('bell', 'New like the post.')

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
router.post('/unlike/:id', accessTokenVerify, isUserExistIdBody, isPostExist, (req, res) => {

    Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.who_id } })
        .then(resp => {
            res.status(200).json({ msg: "Post unliked." })
        }).catch(err => {
            return res.status(500).json({ error: "Database unlike post problem." })
        })

})
module.exports = router;
