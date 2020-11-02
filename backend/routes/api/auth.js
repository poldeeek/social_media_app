require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// User model 
const User = require("../../models/User");

// Friends model
const Friends = require('../../models/Friends')

// Handle errors
const { registerErrorsHandler } = require("../handleErrors/auth");


const cookieMaxAge = 15 * 24 * 60 * 60 * 1000;

// Generate tokens
const generateTokens = userID => {
    const ACCESS_TOKEN = jwt.sign({
        sub: userID,
        type: 'ACCESS_TOKEN'
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const REFRESH_TOKEN = jwt.sign({
        sub: userID,
        type: 'REFRESH_TOKEN'
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '15d' }
    );
    return {
        accessToken: ACCESS_TOKEN,
        refreshToken: `Bearer ${REFRESH_TOKEN}`
    }
}

// @route   POST api/auth/register
// @desc    Register new user
// @access  Public

router.post('/register', async (req, res) => {
    const { name, surname, email, password, city, birth } = req.body;


    // Length password validation
    if (password.length < 6) {
        return res.status(400).send({
            error: {
                password: "Hasło musi posiadać co najmniej 6 znaków."
            }
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            surname,
            city,
            birth,
        })
        newUser.save()
            .then(async user => {
                const user_response = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    city: user.city,
                    birth: user.birth,
                    avatar: user.avatar
                }

                const friends = new Friends({
                    user_id: user._id
                })

                friends.save();

                const tokens = await generateTokens(user);

                res.cookie('refreshToken', tokens.refreshToken, {
                    maxAge: cookieMaxAge,
                    httpOnly: true
                })
                res.status(200).send({
                    msg: "User created.",
                    accessToken: tokens.accessToken,
                    user: user_response
                })
            }).catch(err => {
                const error = registerErrorsHandler(err);
                return res.status(400).json({ error })
            })
    } catch (err) {
        return res.status(500).send({ error: "Creating user error" })
    }
})

// @route   POST api/auth/login
// @desc    Auth user
// @access  Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) return res.status(400).json({ error: "Please enter all fields." })

    // Check for existing user
    User.findOne({ email })
        .then(async user => {
            if (!user) return res.status(404).send({ error: "User does not exist." })

            const compare_password = await bcrypt.compare(password, user.password)

            if (!compare_password) return res.status(401).send({ error: "Wrong password." })

            const user_response = {
                _id: user._id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                city: user.city,
                birth: user.birth,
                avatar: user.avatar
            }

            const tokens = await generateTokens(user);


            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: cookieMaxAge,
                httpOnly: true
            })
            return res.status(200).send({
                msg: "User logged in.",
                accessToken: tokens.accessToken,
                user: user_response
            })

        }).catch(err => {
            return res.status(500).send({ error: "Database problem." })
        })

})

// @route   GET api/auth/refresh
// @desc    Refresh tokens
// @access  Pubilc

router.get('/refresh', (req, res) => {
    if (!req.cookies.refreshToken) return res.status(401).send({ error: "Refresh Token is missing.", verify: false })
    const BEARER = 'Bearer';
    const refresh_token = req.cookies.refreshToken.split(' ');
    if (refresh_token[0] !== BEARER) return res.status(401).send({ error: "Refresh Token is not complete.", verify: false })
    jwt.verify(refresh_token[1], process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return res.status(401).send({ error: "Refresh Token is invalid.", verify: false })
        User.findById(payload.sub, async (err, person) => {
            if (!person) return res.status(401).send({ error: "Person not found.", verify: false })
            const user_response = {
                _id: person._id,
                email: person.email,
                name: person.name,
                surname: person.surname,
                city: person.city,
                birth: person.birth,
                avatar: person.avatar
            }
            const tokens = await generateTokens(user_response._id);
            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: cookieMaxAge,
                httpOnly: true
            })
            return res.status(200).send({
                accessToken: tokens.accessToken,
                user: user_response,
                verify: true
            })
        })
    })
})

// @route   POST api/auth/logout
// @desc    Log out user
// @access  Public

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({ error: "User log out." });

})

module.exports = router;