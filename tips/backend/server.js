//run in website to see json file: http://localhost:5000/places

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests

const PORT = 5000;
const mongoURI = "mongodb://localhost:27017"; // Update if necessary
const dbName = "travel-tips";

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log("MongoDB connected");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// API Route to Get Data from "new" Collection
app.get('/places', async (req, res) => {
  try {
    const places = await db.collection('new').find().toArray();
    res.json(places); // Send JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
