const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const PostSchema = new Schema({
    author_id: {
        type: String,
        required: [true, 'Podaj id autora.'],
    },
    text: {
        type: String,
        required: [true, 'Podaj treść posta.'],
    },
    photo: {
        type: String,
        required: false
    },
    likes: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Posts', PostSchema);