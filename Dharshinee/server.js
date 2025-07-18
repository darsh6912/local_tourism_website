// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const wishlistRoutes = require('./wishlistRoutes');

const app = express();
const PORT = process.env.PORT || 5510;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/Wishlist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));
// Serve static files (including adventure.html)
app.use(express.static(__dirname));

// Serve adventure.html
app.get("/adventure.html", (req, res) => {
    res.sendFile(path.join(__dirname, "adventure.html"));
});
app.get("/beach.html", (req, res) => {
    res.sendFile(path.join(__dirname, "beach.html"));
});
app.get("/culinary.html", (req, res) => {
    res.sendFile(path.join(__dirname, "culinary.html"));
});
app.get("/eco.html", (req, res) => {
    res.sendFile(path.join(__dirname, "eco.html"));
});
app.get("/religious.html", (req, res) => {
    res.sendFile(path.join(__dirname, "religious.html"));
});
app.get("/others.html", (req, res) => {
    res.sendFile(path.join(__dirname, "others.html"));
});
app.get("/wildlife.html", (req, res) => {
    res.sendFile(path.join(__dirname, "wildlife.html"));
});
// Routes
app.use('/app', wishlistRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
