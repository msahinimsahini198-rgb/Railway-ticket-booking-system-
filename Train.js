const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: String,
  arrivalTime: String,
  classes: [String],
  fare: { type: Number, default: 0 },
  availableSeats: { type: Number, default: 0 }
});

module.exports = mongoose.model("Train", trainSchema);
