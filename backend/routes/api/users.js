require('dotenv').config();
const express = require("express");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")
const jwt = require("jsonwebtoken");

const router = express.Router();

// User model 
const User = require("../../models/User");
const { response } = require('express');

// @route   GET api/users/search?q=searchingFraze&p=page&limit=perPage
// @desc    Getting users by id
// @access  Private
router.get('/search', accessTokenVerify, (req, res) => {
    const search = req.query.q.split(' ');
    const page = req.query.p;
    const perPage = req.query.limit;

    console.log(page, perPage)

    let regex = [];
    for (let i = 0; i < search.length; i++) {
        regex[i] = new RegExp(search[i], 'i');
    }

    User.find({
        $or: [
            { name: { $in: regex } },
            { surname: { $in: regex } }
        ]
    }, 'name surname avatar')
        .limit(parseInt(perPage))
        .skip(parseInt(perPage) * parseInt(page))
        .sort({ surname: 'asc', name: 'asc' })
        .then(results => res.status(200).json(results))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

// @route   GET api/users/:id
// @desc    Getting user by id
// @access  Private
router.get('/:id', accessTokenVerify, (req, res) => {
    User.findOne({ _id: req.params.id },
        'avatar email name surname city birth createdAt')
        .then(user => {
            const accessToken = req.headers.authorization.split(' ');

            // Getting request sender ID
            jwt.verify(accessToken[1], process.env.ACCESS_TOKEN_SECRET, (err, payload) => {

                res.status(200).json(user)
            })
        })
        .catch(err => {
            res.status(404).json({ msg: "User does not exist." });
        });
})


module.exports = router;