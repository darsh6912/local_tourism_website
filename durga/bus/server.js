const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/busBooking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Models
const Bus = mongoose.model('Bus', new mongoose.Schema({
  bus_number: String,
  bus_name: String,
  source_station: { code: String, name: String },
  destination_station: { code: String, name: String },
  departure_time: String,
  arrival_time: String,
  days_of_operation: [String],
  bus_type: String,
  operator: String,
  route: [{ stop_code: String, stop_name: String, arrival_time: String, departure_time: String }],
  seats: Number, // Number of seats available
  price_for_1_seat: Number, // Price per seat
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
  bus_number: String,
  source_station: String,
  destination_station: String,
  departure_time: String,
  arrival_time: String,
  booked_at: { type: Date, default: Date.now },
}));

// Routes
// Search buses by source and destination
app.get('/buses', async (req, res) => {
  const { from, to, limit } = req.query;

  try {
    let query = {};
    if (from && to) {
      query = {
        'source_station.name': { $regex: from, $options: 'i' },
        'destination_station.name': { $regex: to, $options: 'i' },
      };
    }

    const buses = limit 
      ? await Bus.find(query).limit(parseInt(limit)) 
      : await Bus.find(query);

    res.json(buses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/buses', async (req, res) => {
  const bus = new Bus(req.body);
  try {
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post('/bookings', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    await booking.save();
    res.status(201).json({ message: 'Bus booked successfully!', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/more', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'more.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
