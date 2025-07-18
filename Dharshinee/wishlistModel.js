const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {  // Reference to the user table
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    // Refers to the User model
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
