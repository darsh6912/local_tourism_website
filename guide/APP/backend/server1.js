const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/guide", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Define Schema and Model BEFORE using it
const DetailsSchema = new mongoose.Schema({}, { strict: false }); // Allows all fields
const Details = mongoose.model("Details", DetailsSchema, "Details"); // Explicitly specify collection name

// ✅ API Route to Fetch Data
app.get("/guides", async (req, res) => {
  try {
      let location = req.query.location;
      let query = location ? { Location: { $regex: new RegExp(location, "i") } } : {};

      // Use Mongoose's find method to query
      const guides = await Details.find(query);
      res.json(guides);
  } catch (err) {
      res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start the Server
app.listen(3019, () => {
  console.log("Server running on port 3019");
});