const mongoose = require("mongoose");

const plannedTripSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  distance: { type: Number, required: true },
  path: { type: [String], required: true }, // Array of location names
  roundTrip: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the trip was planned
});

module.exports = mongoose.model("PlannedTrip", plannedTripSchema);
