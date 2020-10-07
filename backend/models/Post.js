const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};

// Create schema 
const PostSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
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
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Users',
        }]
    }
},
    { timestamps: opts }
);

module.exports = mongoose.model('Posts', PostSchema);