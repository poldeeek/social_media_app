const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const ChatSchema = new Schema({
    users: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Users',
        }, {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        }],
        required: [true, 'Podaj uczestników czatu.'],
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: opts });

module.exports = mongoose.model('Chat', ChatSchema);