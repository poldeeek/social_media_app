const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema 
const FriendsSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'Podaj id użytkownika.'],
    },
    friends: [String]
});

module.exports = mongoose.model('Friends', FriendsSchema);