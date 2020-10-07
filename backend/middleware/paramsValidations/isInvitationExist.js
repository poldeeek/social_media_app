// Invitation model 
const Invitation = require('../../models/Invitation');

// use isUserExistBodyId and isuserExistParamsId before
// check if user exist in data base (id in params)
exports.isInvitationExist = (req, res, next) => {

    Invitation.findOne({
        user_id: req.params.id,
        invited_user_id: req.body._id
    }).then(result => {
        if (!result) return res.status(404).json({ error: "Invitation does not exist." });
        next()
    }).catch(err => {
        return res.status(500).json({ error: "Invitation finding error." })
    })
}
