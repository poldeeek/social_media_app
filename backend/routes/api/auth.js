require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")

const router = express.Router();

// User model 
const User = require("../../models/User");

// Handle errors
const { registerErrorsHandler } = require("../handleErrors/auth");

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
        res.status(400).send({
            errors: {
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
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    city: user.city,
                    birth: user.birth,
                    avatar: user.avatar
                }

                const tokens = await generateTokens(user);

                res.cookie('refreshToken', tokens.refreshToken, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                res.status(200).send({
                    msg: "User created.",
                    accessToken: tokens.accessToken,
                    user: user_response
                })
            }).catch(err => {
                console.log(err)
                const errors = registerErrorsHandler(err);
                res.status(400).json({ errors })
            })
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Creating user error" })
    }
})

// @route   POST api/auth/login
// @desc    Auth user
// @access  Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) return res.status(400).json({ msg: "Please enter all fields." })

    // Check for existing user
    User.findOne({ email })
        .then(async user => {
            if (!user) return res.status(404).send({ msg: "User does not exist." })

            const compare_password = await bcrypt.compare(password, user.password)

            if (!compare_password) return res.status(401).send({ msg: "Wrong password." })

            const user_response = {
                id: user._id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                city: user.city,
                birth: user.birth,
                avatar: user.avatar
            }

            const tokens = await generateTokens(user);

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.status(200).send({
                msg: "User logged in.",
                accessToken: tokens.accessToken,
                user: user_response
            })
        })

})

// @route   GET api/auth/refresh
// @desc    Refresh tokens
// @access  Pubilc

router.get('/refresh', (req, res) => {
    if (!req.cookies.refreshToken) return res.status(401).send({ msg: "Refresh Token is missing.", verify: false })
    const BEARER = 'Bearer';
    const refresh_token = req.cookies.refreshToken.split(' ');
    if (refresh_token[0] !== BEARER) return res.status(401).send({ msg: "Refresh Token is not complete.", verify: false })
    jwt.verify(refresh_token[1], process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return res.status(401).send({ msg: "Refresh Token is invalid.", verify: false })
        User.findById(payload.sub, async (err, person) => {
            if (!person) return res.status(401).send({ msg: "Person not found.", verify: false })
            const user_response = {
                id: person._id,
                email: person.email,
                name: person.name,
                surname: person.surname,
                city: person.city,
                birth: person.birth,
                avatar: person.avatar
            }
            const tokens = await generateTokens(user_response.id);
            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.status(200).send({
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
    res.status(200).json({ msg: "User log out." });
})

module.exports = router;