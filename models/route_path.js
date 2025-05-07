const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  distance: { type: Number, required: true },
});

module.exports = mongoose.model("Route", routeSchema);
