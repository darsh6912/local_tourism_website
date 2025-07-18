const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  carType: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  fuelType: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Car', carSchema);

