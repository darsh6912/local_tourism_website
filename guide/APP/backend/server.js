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

// ✅ Booking Schema
const BookingSchema = new mongoose.Schema({
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: "Details", required: true },
    bookedAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model("Booking", BookingSchema, "Bookings"); // Collection name is "Bookings"

// ✅ API Route to Fetch Data
app.get("/guides", async (req, res) => {
  try {
      let location = req.query.location;
      let query = location ? { Location: { $regex: new RegExp(location, "i") } } : {};

      const guides = await Details.find(query);
      res.json(guides);
  } catch (err) {
      res.status(500).json({ error: "Server error" });
  }
});

// ✅ Booking a guide
app.post("/book/:id", async (req, res) => {
    try {
        const guideId = req.params.id;
        console.log(`Booking request received for guideId: ${guideId}`);

        const validObjectId = new mongoose.Types.ObjectId(guideId);

        const guide = await Details.findById(validObjectId);
        if (!guide) {
            console.log("Guide not found!");
            return res.status(404).json({ message: "Guide not found!" });
        }

        const existingBooking = await Booking.findOne({ guideId: validObjectId });
        if (existingBooking) {
            console.log("Guide already booked!");
            return res.status(400).json({ message: "Guide is already booked!" });
        }

        const newBooking = new Booking({ guideId: validObjectId });
        await newBooking.save();
        console.log("Booking saved successfully!");

        res.json({ message: "Guide booked successfully!" });
    } catch (error) {
        console.error("Error booking guide:", error);
        res.status(500).json({ error: "Error booking guide" });
    }
});

// ✅ Canceling a booking (with FIX)
app.delete("/cancel/:id", async (req, res) => {
  try {
    const guideId = req.params.id;

    const objectId = mongoose.Types.ObjectId.isValid(guideId) ? new mongoose.Types.ObjectId(guideId) : null;

    if (!objectId) {
      return res.status(400).json({ message: "Invalid guide ID format." });
    }

    const deletedBooking = await Booking.findOneAndDelete({ guideId: objectId });

    if (!deletedBooking) {
      return res.status(404).json({ message: "No booking found for this guide." });
    }

    res.json({ message: "Booking canceled successfully." });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ error: "Error canceling booking." });
  }
});

// ✅ Start the Server
app.listen(3019, () => {
  console.log("Server running on port 3019");
});
