const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images
app.use("/img", express.static(path.join(__dirname, "public/img")));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/hotelDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Hotel Schema
const hotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    image: String,
    description: String,
    amenities: [String],
    lat: Number,
    lng: Number,
    totalRooms: Number,      // Total rooms initially
    roomsAvailable: Number   // Available rooms for booking
});

const Hotel = mongoose.model("Hotel", hotelSchema);

// API to get all hotels
app.get("/api/hotels", async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels", error: error.message });
    }
});

// API to get a single hotel by ID
app.get("/api/hotels/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel details", error: error.message });
    }
});

// ✅ API to check room availability
app.post("/api/hotels/:id/availability", async (req, res) => {
    try {
        const { checkin, checkout } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ available: false, message: "Hotel not found" });
        }

        if (hotel.roomsAvailable > 0) {
            return res.json({ available: true, message: "Rooms available!" });
        } else {
            return res.json({ available: false, message: "No rooms available!" });
        }
    } catch (error) {
        res.status(500).json({ available: false, message: "Error checking availability", error: error.message });
    }
});

// ✅ API to book a hotel room
app.post("/api/hotels/:id/book", async (req, res) => {
    try {
        const { roomsToBook } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) return res.status(404).send({ success: false, message: "Hotel not found" });

        if (hotel.roomsAvailable >= roomsToBook) {
            hotel.roomsAvailable -= roomsToBook;
            await hotel.save();
            res.json({ success: true, message: `${roomsToBook} room(s) booked successfully!` });
        } else {
            res.json({ success: false, message: "Not enough rooms available!" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Error booking room" });
    }
});

/*
app.post("/api/hotels/:id/book", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        if (hotel.roomsAvailable > 0) {
            hotel.roomsAvailable -= 1; // Reduce available rooms
            await hotel.save();
            return res.json({ success: true, message: "Room booked successfully!" });
        } else {
            return res.json({ success: false, message: "No rooms available!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error booking room", error: error.message });
    }
});
*/

// Start Server
app.listen(5500, () => console.log("Server running on port 5500"));
