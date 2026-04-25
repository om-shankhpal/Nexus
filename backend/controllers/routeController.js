const Bin = require("../models/Bin");
const Route = require("../models/Route");
const { optimizeRoute } = require("../utils/optimizer");

function toPathPoint(bin) {
  const loc = bin?.location;
  if (!loc) return null;
  const lat = Number(loc.lat);
  const lng = Number(loc.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

async function generateOptimizedRoute(req, res, next) {
  try {
    const fullBins = await Bin.find({ status: "FULL" }).lean();

    if (!fullBins.length) {
      return res.status(200).json({
        success: true,
        data: { optimizedBins: [], optimizedPath: [], totalDistance: 0 },
      });
    }

    const { optimizedBins, totalDistance } = optimizeRoute(fullBins);

    const optimizedPath = optimizedBins
      .map((b) => ({ location: b.location }))
      .map((b) => toPathPoint(b))
      .filter(Boolean);

    const bins = optimizedBins.map((b) => b._id);

    const avgSpeedKmPerHour = 30;
    const estimatedTime =
      totalDistance === 0
        ? 0
        : Math.round((totalDistance / avgSpeedKmPerHour) * 60); // minutes

    const routeDoc = await Route.create({
      bins,
      optimizedPath,
      totalDistance,
      estimatedTime,
    });

    return res.status(201).json({
      success: true,
      data: {
        route: routeDoc,
        optimizedBins,
        optimizedPath,
        totalDistance,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getRouteHistory(req, res, next) {
  try {
    const routes = await Route.find().sort({ createdAt: -1 }).populate("bins");
    return res.status(200).json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateOptimizedRoute, getRouteHistory };
