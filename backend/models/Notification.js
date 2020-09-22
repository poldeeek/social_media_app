const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const NotificationSchema = new Schema({
    object_id: {
        type: String,
        required: [true, 'Podaj id obiektu.'],
    },
    user_id: {
        type: String,
        required: [true, 'Podaj id użytkownika.'],
    },
    type: {
        type: Number,
        required: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    who_id: {
        type: String
    }
},
    opts
);

module.exports = mongoose.model('Notifications', NotificationSchema);