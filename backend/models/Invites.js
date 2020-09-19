const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const InviteSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'Podaj id użytkownika.'],
    },
    invites: {
        type: [{
            _id: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            seen: {
                type: Boolean,
                default: false
            }
        }]
    }
});

module.exports = mongoose.model('Invites', InviteSchema);