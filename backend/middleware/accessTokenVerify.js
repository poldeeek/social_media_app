require('dotenv').config();
const jwt = require("jsonwebtoken");


//  Access Token Verify
exports.accessTokenVerify = (req, res, next) => {
    if (!req.headers['authorization']) return res.status(401).send({ msg: "Access Token is missing.", code: "accesToken/error" })


    const BEARER = 'Bearer';
    const auth_token = req.headers.authorization.split(' ');
    if (auth_token[0] !== BEARER) return res.status(401).send({ msg: "Access Token is not complete.", code: "accesToken/error" })

    jwt.verify(auth_token[1], process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return res.status(401).send({ msg: "Access Token is invalid.", code: "accessToken/error" })
        next();
    })
}