const Bin = require("../models/Bin");
const Route = require("../models/Route");
const { optimizeRoute } = require("../utils/optimizer");
const { calculateDistance } = require("../utils/haversine");

const User = require("../models/User");

function toPathPoint(bin) {
  const loc = bin?.location;
  if (!loc) return null;
  const lat = Number(loc.lat);
  const lng = Number(loc.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function getSegregationPriority(bin) {
  const type = bin?.segregationType || "MIXED";
  const status = bin?.status || "EMPTY";

  // Lower score = higher priority.
  const typePriority = {
    E_WASTE: 0,
    WET: 1,
    DRY: 2,
    PLASTIC: 3,
    MIXED: 4,
  };

  const statusPriority = {
    FULL: 0,
    MEDIUM: 1,
    EMPTY: 2,
  };

  return (typePriority[type] ?? 4) * 10 + (statusPriority[status] ?? 2);
}

function calculatePathDistance(points) {
  if (!Array.isArray(points) || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (!a?.location || !b?.location) continue;
    total += calculateDistance(
      a.location.lat,
      a.location.lng,
      b.location.lat,
      b.location.lng
    );
  }
  return total;
}

function optimizeBySegregationPriority(driverStart, bins) {
  // Weighted nearest-neighbor:
  // - distance dominates for shortest overall travel
  // - segregation priority influences tie-break and close choices
  const PRIORITY_WEIGHT_KM = 1.5;

  const remaining = [...bins];
  const ordered = [driverStart];
  let current = driverStart;

  while (remaining.length) {
    let bestIdx = 0;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const distanceKm = calculateDistance(
        current.location.lat,
        current.location.lng,
        candidate.location.lat,
        candidate.location.lng
      );
      const priorityScore = getSegregationPriority(candidate);
      const weightedScore = distanceKm + priorityScore * PRIORITY_WEIGHT_KM;

      if (weightedScore < bestScore) {
        bestScore = weightedScore;
        bestIdx = i;
      }
    }

    const nextBin = remaining.splice(bestIdx, 1)[0];
    ordered.push(nextBin);
    current = nextBin;
  }

  // Final 2-opt pass improves shortest-path quality while preserving start.
  const { optimizedBins } = optimizeRoute(ordered);

  return {
    optimizedBins,
    totalDistance: calculatePathDistance(optimizedBins),
  };
}

async function generateOptimizedRoute(req, res, next) {
  try {
    const { driverLat, driverLng, driverId } = req.body || {};

    if (driverLat === undefined || driverLng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Driver's live location is required to generate a local route.",
      });
    }

    // Collect all bins and let segregation-aware optimizer determine visit order.
    const rawBinsToCollect = await Bin.find({}).lean();

    let dLat = Number(driverLat);
    let dLng = Number(driverLng);

    // Store in DB and use those stored coordinates
    if (driverId) {
      const updatedUser = await User.findByIdAndUpdate(
        driverId,
        { location: { lat: dLat, lng: dLng } },
        { new: true }
      );
      if (updatedUser && updatedUser.location) {
        dLat = updatedUser.location.lat;
        dLng = updatedUser.location.lng;
      }
    }

    // Ensure bins have valid coordinates before pathing
    const binsToCollect = rawBinsToCollect.filter((bin) => {
      return bin.location && typeof bin.location.lat === "number" && typeof bin.location.lng === "number";
    });

    if (!binsToCollect.length) {
      return res.status(200).json({
        success: true,
        message: "No bins with valid coordinates found in the network.",
        data: {
          optimizedBins: [],
          optimizedPath: [],
          totalDistance: 0,
        },
      });
    }

    // Driver location is the mandatory starting point
    const driverStart = {
      _id: "DRIVER_START",
      location: { lat: dLat, lng: dLng },
      isDriver: true,
    };

    // Prioritize segregation first, then shortest path within each priority band.
    const { optimizedBins, totalDistance } = optimizeBySegregationPriority(
      driverStart,
      binsToCollect
    );

    // Keep route ending point near the configured start location.
    const routeEndPoint = {
      lat: dLat + 0.01,
      lng: dLng + 0.01,
    };

    let totalDistanceWithEnd = totalDistance;
    const lastOptimizedPoint = optimizedBins[optimizedBins.length - 1];
    if (lastOptimizedPoint?.location) {
      totalDistanceWithEnd += calculateDistance(
        lastOptimizedPoint.location.lat,
        lastOptimizedPoint.location.lng,
        routeEndPoint.lat,
        routeEndPoint.lng
      );
    }

    const optimizedBinsWithEnd = [
      ...optimizedBins,
      {
        _id: "ROUTE_END",
        location: routeEndPoint,
        isRouteEnd: true,
      },
    ];

    const optimizedPath = optimizedBinsWithEnd
      .map((b) => ({ location: b.location }))
      .map((b) => toPathPoint(b))
      .filter(Boolean);

    // Filter out the driver point from the bins list for the DB
    const routeBinIds = optimizedBinsWithEnd
      .filter((b) => !b.isDriver)
      .filter((b) => !b.isRouteEnd)
      .map((b) => b._id);

    const avgSpeedKmPerHour = 30;
    const estimatedTime =
      totalDistanceWithEnd === 0
        ? 0
        : Math.round((totalDistanceWithEnd / avgSpeedKmPerHour) * 60);

    const routeDoc = await Route.create({
      bins: routeBinIds,
      optimizedPath,
      totalDistance: totalDistanceWithEnd,
      estimatedTime,
    });

    // Simulate completion of the generated route by marking all routed bins as collected.
    await Bin.updateMany(
      { _id: { $in: routeBinIds } },
      {
        $set: {
          fillLevel: 0,
          status: "EMPTY",
          lastCollectedAt: new Date(),
        },
      }
    );

    const updatedRoutedBins = await Bin.find({ _id: { $in: routeBinIds } }).lean();
    const updatedById = new Map(updatedRoutedBins.map((b) => [String(b._id), b]));
    const orderedUpdatedBins = routeBinIds
      .map((id) => updatedById.get(String(id)))
      .filter(Boolean);

    return res.status(201).json({
      success: true,
      data: {
        route: routeDoc,
        optimizedBins: orderedUpdatedBins,
        optimizedPath,
        totalDistance: totalDistanceWithEnd,
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
