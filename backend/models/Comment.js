const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const CommentSchema = new Schema({
    author_id: {
        type: String,
        required: [true, 'Podaj id autora.'],
    },
    post_id: {
        type: String,
        required: [true, 'Podaj id posta.']
    },
    text: {
        type: String,
        required: [true, 'Podaj treść komentarza.'],
    },
    likes: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comments', CommentSchema);