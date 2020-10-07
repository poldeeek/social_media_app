// Post model 
const Comment = require('../../models/Comment');

// use isUserExistBodyId and isuserExistParamsId before
// check if user exist in data base (id in params)
exports.isCommentExist = (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing comment id (params)." });

    Comment.findOne({
        _id: req.params.id
    }).then(result => {
        if (!result) return res.status(404).json({ error: "Comment does not exist." });
        next()
    }).catch(err => {
        return res.status(500).json({ error: "Comment finding error." })
    })
}
