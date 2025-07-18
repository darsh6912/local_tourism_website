const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); 
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

// Serve static files (optional, if needed)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection for Train Details
mongoose.connect('mongodb://localhost:27017/traindetails', {})
  .then(() => console.log('Connected to MongoDB for Train Details'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// Train Schema
const trainSchema = new mongoose.Schema({
  "S.No": Number,
  "Train No.": String,
  "Train Name": String,
  From: String,
  "Departure Time": String,
  Day: Number,
  To: String,
  "Arrival Time": String,
  "Arrival Day": Number,
  Frequency: String,
  "Owning Rly": String,
  "Days of Operations": String,
});

const Train = mongoose.model('Train', trainSchema);

// API to Fetch Train Details
app.get('/trains', async (req, res) => {
  try {
    const trains = await Train.find();

    // Transform data for consistency
    const transformedTrains = trains.map(train => ({
      SNo: train["S.No"] || 'N/A',
      TrainNo: train["Train No"] || 'N/A',
      TrainName: train["Train Name"] || 'N/A',
      From: train.From || 'N/A',
      DepartureTime: train["Departure Time"] || 'N/A',
      Day: train.Day || 'N/A',
      To: train.To || 'N/A',
      ArrivalTime: train["Arrival Time"] || 'N/A',
      ArrivalDay: train["Arrival Day"] || 'N/A',
      Frequency: train.Frequency || 'N/A',
      DaysOfOperations: train["Days of Operations"] || 'N/A',
    }));

    res.json(transformedTrains);
  } catch (error) {
    console.error('Error retrieving train details:', error);
    res.status(500).json({ message: 'Error retrieving train details', error: error.message });
  }
});

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tickets: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: String, required: true }, // Store the date
  trainDetails: { type: Object, required: true }, // Store train details
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// POST endpoint to handle reservations
app.post('/reserve', async (req, res) => {
  try {
    const { name, email, phone, tickets, totalPrice, date, trainDetails } = req.body;

    // Validate input
    if (!name || !email || !phone || !tickets || !totalPrice || !date || !trainDetails) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const reservation = new Reservation({
      name,
      email,
      phone,
      tickets,
      totalPrice,
      date,
      trainDetails,
    });

    await reservation.save();
    res.status(200).json({ message: 'Reservation saved successfully' });
  } catch (error) {
    console.error('Error saving reservation:', error);
    res.status(500).json({ message: 'Error saving reservation', error: error.message });
  }
});

// Start the Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
