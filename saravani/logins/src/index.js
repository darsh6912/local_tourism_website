const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

const PORT = 8612;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Login-tut')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));


// Define Schema and Model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("users", UserSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

// **Login API**
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (user) {
    // ✅ Ensure `_id` is returned as `userid`
    res.json({
      success: true,
      token: "sample_token", // Replace with actual JWT token if used
      username: user.username, // Ensure `username` is returned
      userid: user._id.toString() // Convert `_id` to string
  });
  } else {
    res.json({ success: false, message: "Invalid Username or Password" });
  }
});

// **Signup API**
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.json({ success: false, message: "User already exists" });
  }

  const newUser = new User({ username, password });
  await newUser.save();
  res.json({ success: true });
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
