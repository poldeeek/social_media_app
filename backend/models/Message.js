const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const MessageSchema = new Schema({
    chat_id: {
        type: String,
        required: [true, 'Podaj id chatu.'],
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Podaj id nadawcy.'],
    },
    text: {
        type: String,
        required: [true, 'Podaj treść wiadomości.']
    },
    photo: {
        type: String,
        required: false
    }
}, { timestamps: opts });

module.exports = mongoose.model('Message', MessageSchema);