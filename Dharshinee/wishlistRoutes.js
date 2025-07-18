// wishlistRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('./wishlistModel');

// POST route to add item to wishlist
router.post('/add', async (req, res) => {
    try {
        const { userId, url, title } = req.body;

        // Check if the data is valid
        if (!url || !title) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new wishlist item
        const newItem = new Wishlist({
            userId,
            url,
            title,
        });

        // Save the item to the database
        await newItem.save();

        // Respond with the saved item
        res.status(201).json({ message: 'Item added to wishlist', data: newItem });
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        res.status(500).json({ error: 'Failed to add item to wishlist' });
    }
});



router.get('/get_wish', async (req, res) => {
    try {
        const { userid } = req.query; // Get userId from request query

        if (!userid) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Convert userId string to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userid);

        // Fetch wishlist items for the given userId
        const items = await Wishlist.find({ userId: userObjectId });

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found in wishlist for this user' });
        }

        res.status(200).json({ items });
    } catch (error) {
        console.error('Error retrieving wishlist items:', error);
        res.status(500).json({ error: 'Failed to retrieve wishlist items' });
    }
});


module.exports = router;
