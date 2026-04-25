const mongoose = require("mongoose");

const BinSchema = new mongoose.Schema(
  {
    location: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lng: { type: Number, required: true, min: -180, max: 180 },
    },
    fillLevel: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["EMPTY", "MEDIUM", "FULL"],
      default: "EMPTY",
    },
    segregationType: {
      type: String,
      enum: ["WET", "DRY", "PLASTIC", "E_WASTE", "MIXED"],
      default: "MIXED",
    },
    lastCollectedAt: { type: Date },
  },
  { timestamps: true }
);

const Bin = mongoose.model("Bin", BinSchema);
module.exports = Bin;

