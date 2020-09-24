const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const InvitationSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'Podaj id zapraszającego użytkownika.'],
    },
    invited_user_id: {
        type: String,
        required: [true, 'Podaj id zapraszanego użytkownika.']
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Invitation', InvitationSchema);