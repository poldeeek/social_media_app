const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    updatedAt: 'updated_at'
};

// Create schema 
const ChatSchema = new Schema({
    users: {
        type: [String, String],
        required: [true, 'Podaj uczestników czatu.'],
    },
    seen: {
        type: Boolean,
        default: true
    }
}, opts);

module.exports = mongoose.model('Chat', ChatSchema);