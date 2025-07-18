const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to MongoDB database "paymentDB"
mongoose.connect('mongodb://localhost:27017/paymentDB')
    .then(() => console.log("✅ Connected to MongoDB (paymentDB)"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema for Payments Collection
const paymentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    date: String,
    paymentMethod: String,
    walletProvider: String,
    upiId: String,
    mobileNumber: String,
    walletPassword: String
});

// Correct collection name
const Payment = mongoose.model("Payment", paymentSchema, "payments");

// Default Route to Prevent "Cannot GET /"
app.get("/", (req, res) => {
    res.send("✅ Payment API is running!");
});

// Handle Payment Data Submission
app.post("/payment", async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { name, phone, email, date, paymentMethod, walletProvider, upiId, mobileNumber, walletPassword } = req.body;
        
        if (!name || !phone || !email || !date || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const payment = new Payment({ name, phone, email, date, paymentMethod, walletProvider, upiId, mobileNumber, walletPassword });
        await payment.save();
        console.log("✅ Payment saved successfully!");

        res.json({ message: "Payment saved successfully!" });
    } catch (error) {
        console.error("❌ Error processing payment:", error);
        res.status(500).json({ message: "Error processing payment" });
    }
});

app.listen(8617, () => {
    console.log("🚀 Server running on port 8617");
});
