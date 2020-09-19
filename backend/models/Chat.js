const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const ChatSchema = new Schema({
    users: {
        type: [String, String],
        required: [true, 'Podaj uczestników czatu.'],
    },
    lase_message_date: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Chat', ChatSchema);