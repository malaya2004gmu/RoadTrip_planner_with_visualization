const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
locationSchema.index({ name: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("Location", locationSchema);
