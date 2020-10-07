// Post model 
const Post = require('../../models/Post');

// use isUserExistBodyId and isuserExistParamsId before
// check if user exist in data base (id in params)
exports.isPostExist = (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing post id (params)." });

    Post.findOne({
        _id: req.params.id
    }).then(result => {
        if (!result) return res.status(404).json({ error: "Post does not exist." });
        next()
    }).catch(err => {
        return res.status(500).json({ error: "Post finding error." })
    })
}
