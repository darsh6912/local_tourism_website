const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); 
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

; // Replace with your frontend URL if different

app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static('public'));  // Adjust if you have a different folder for HTML files

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/carBooking',{})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Car Schema
const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  carType: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  fuelType: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  carType: String,
  carModel: String,
  price: Number,
  pickupDate: String,
  pickupLocation: String,
  returnDate: String,
  dropLocation: String,
  paymentMethod: String,
});

const Car = mongoose.model('Car', carSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Endpoint to fetch all cars
app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    console.log("Fetched Cars:", cars);  
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
});

// Endpoint to handle bookings
app.post('/book', async (req, res) => {
  const bookingData = req.body;
  const pickupDate = new Date(bookingData.pickupDate);
  const returnDate = new Date(bookingData.returnDate);

  // Check if the return date is later than the pickup date
  if (returnDate <= pickupDate) {
    return res.status(400).json({ message: 'Return date must be later than pickup date.' });
  }

  // Calculate the number of days between pickup and return dates
  const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));

  const car = await Car.findOne({ carType: bookingData.carType, model: bookingData.carModel });

  if (!car) {
    return res.status(400).json({ message: 'Car not available' });
  }

  // Calculate total price
  const totalPrice = days * car.pricePerDay;

  bookingData.price = totalPrice;

  // Create and save the booking
  const booking = new Booking(bookingData);
  await booking.save();

  // Send a response back with booking details
  res.json({ message: 'Booking successful!', price: totalPrice });
});

// app.get('/booking-confirmation', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'booking-confirmation.html')); // Ensure correct file path
// });
// app.get('/booking-confirmation', (req, res) => {
//   res.json({
//     message: 'Booking confirmed!',
//     // Add more data as necessary
//   });
// });
app.get('/booking-confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, 'booking-confirmation.html'));
});


// Backend route to handle booking and send confirmation data
// Backend route to handle booking and send confirmation data
app.post('/book-car', async (req, res) => {
  const bookingData = req.body;

  // Validate and save booking data to the database
  try {
      const booking = new Booking(bookingData);
      await booking.save();

      res.status(200).json({ message: 'Booking confirmed!' });
  } catch (error) {
      res.status(500).json({ message: 'Error processing booking: ' + error.message });
  }
});

// Start the server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});