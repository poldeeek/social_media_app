const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const CommentSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Podaj id autora.'],
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Podaj id posta.']
    },
    text: {
        type: String,
        required: [true, 'Podaj treść komentarza.'],
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Users',
        }]
    }
}, { timestamps: opts });

module.exports = mongoose.model('Comments', CommentSchema);