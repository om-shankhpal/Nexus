const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    bins: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Bin", required: true },
    ],
    optimizedPath: [
      {
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 },
      },
    ],
    totalDistance: { type: Number, required: true, min: 0 },
    estimatedTime: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", RouteSchema);
module.exports = Route;

