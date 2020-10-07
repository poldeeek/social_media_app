const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const ChatSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
        required: [true, 'Podaj uczestników czatu.'],
    },
    seen: {
        type: Boolean,
        default: true
    }
}, { timestamps: opts });

module.exports = mongoose.model('Chat', ChatSchema);