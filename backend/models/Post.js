const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

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
    }
},
    opts
);

module.exports = mongoose.model('Posts', PostSchema);