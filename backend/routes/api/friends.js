require('dotenv').config();
const express = require('express');
const { accessTokenVerify } = require("../../middleware/accessTokenVerify")

const router = express.Router();

// Friends model
const Friends = require('../../models//Friends');


module.exports = router;
