const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const InvitationsSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'Podaj id użytkownika.'],
    },
    invitations: {
        type: [{
            _id: {
                type: String,
            },
            seen: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }
});

module.exports = mongoose.model('Invitations', InvitationsSchema);