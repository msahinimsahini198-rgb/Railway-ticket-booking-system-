const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  pnr: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
  passengers: [{
    name: String,
    age: Number,
    gender: String
  }],
  journeyDate: String,
  classType: String,
  totalFare: Number,
  status: { type: String, default: "Confirmed" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
