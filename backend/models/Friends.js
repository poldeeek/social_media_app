const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const FriendsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Podaj id użytkownika.'],
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        }
    ]
});

module.exports = mongoose.model('Friends', FriendsSchema);