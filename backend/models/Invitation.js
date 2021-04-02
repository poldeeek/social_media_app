const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const InvitationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Podaj id zapraszającego użytkownika.'],
    },
    invited_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Podaj id zapraszanego użytkownika.']
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: opts });

module.exports = mongoose.model('Invitation', InvitationSchema);