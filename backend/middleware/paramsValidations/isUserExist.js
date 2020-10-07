// User model 
const User = require('../../models/User');

// check if user exist in data base (id in params)
exports.isUserExistIdParams = (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing user id (params)." });

    User.findOne({ _id: id })
        .then(result => {
            if (!result) return res.status(404).json({ error: "User does not exist (params)." })
            next();
        }).catch(err => {
            return res.status(500).json({ error: "User finding error." })
        })
}

// check if user exist in data base (id in body)
exports.isUserExistIdBody = async (req, res, next) => {
    let id;

    if (req.body._id) {
        id = req.body._id;
        await User.findOne({ _id: id })
            .then(result => {
                if (!result) return res.status(404).json({ error: "User does not exist (body)." })
            }).catch(err => {
                return res.status(500).json({ error: "User finding error." })
            })
    }

    if (req.body.author_id) {
        id = req.body.author_id;
        await User.findOne({ _id: id })
            .then(result => {
                if (!result) return res.status(404).json({ error: "User does not exist (body)." })
            }).catch(err => {
                return res.status(500).json({ error: "User finding error." })
            })
    }

    if (req.body.user_id) {
        id = req.body.user_id;
        await User.findOne({ _id: id })
            .then(result => {
                if (!result) return res.status(404).json({ error: "User does not exist (body)." })
            }).catch(err => {
                return res.status(500).json({ error: "User finding error." })
            })
    }


    if (req.body.who_id) {
        id = req.body.who_id;
        await User.findOne({ _id: id })
            .then(result => {
                if (!result) return res.status(404).json({ error: "User does not exist (body)." })
            }).catch(err => {
                return res.status(500).json({ error: "User finding error." })
            })
    }

    if (!id) return res.status(400).json({ error: "Missing user id (body)." });

    next();
}