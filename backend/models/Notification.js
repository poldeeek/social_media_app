const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const NotificationSchema = new Schema({
    object_id: {
        type: Schema.Types.ObjectId,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Podaj id użytkownika.'],
    },
    type: {
        type: String,
        required: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    who_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    }
},
    { timestamps: opts }
);

module.exports = mongoose.model('Notifications', NotificationSchema);