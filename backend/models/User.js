const mongoose = require("mongoose");
const { isEmail } = require("validator")

const Schema = mongoose.Schema;

// Create schema 
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Podaj imie.'],
    },
    surname: {
        type: String,
        required: [true, 'Podaj nazwisko.'],
    },
    email: {
        type: String,
        required: [true, 'Podaj adres email.'],
        unique: true,
        vlidate: [isEmail, 'Niewłaściwy adres email.']
    },
    password: {
        type: String,
        required: [true, 'Podaj hasło.']
    },
    city: {
        type: String,
        required: [true, 'Podaj miasto.'],
    },
    birth: {
        type: String,
        required: [true, 'Podaj date urodzenia.'],
    },
    avatar: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/social-media-app-a9d81.appspot.com/o/avatars%2Fdefault-user-image.png?alt=media&token=cf97dbb1-4906-46d4-bf2c-28b523b8da00'
    },
    online: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);