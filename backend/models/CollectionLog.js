const mongoose = require("mongoose");

const CollectionLogSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    binsCollected: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Bin", required: true },
    ],
    totalBins: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CollectionLog = mongoose.model("CollectionLog", CollectionLogSchema);
module.exports = CollectionLog;

