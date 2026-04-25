const Route = require("../models/Route");
const CollectionLog = require("../models/CollectionLog");

async function getAnalytics(req, res, next) {
  try {
    const [routeAgg] = await Route.aggregate([
      {
        $group: {
          _id: null,
          totalRoutesExecuted: { $sum: 1 },
          averageRouteDistance: { $avg: "$totalDistance" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRoutesExecuted: 1,
          averageRouteDistance: { $ifNull: ["$averageRouteDistance", 0] },
        },
      },
    ]);

    const [logAgg] = await CollectionLog.aggregate([
      {
        $group: {
          _id: null,
          totalBinsCollected: { $sum: "$totalBins" },
        },
      },
      {
        $project: {
          _id: 0,
          totalBinsCollected: { $ifNull: ["$totalBinsCollected", 0] },
        },
      },
    ]);

    const totalRoutesExecuted = routeAgg?.totalRoutesExecuted ?? 0;
    const totalBinsCollected = logAgg?.totalBinsCollected ?? 0;
    const averageRouteDistance = routeAgg?.averageRouteDistance ?? 0;
    const estimatedFuelSavings = averageRouteDistance * 0.1;

    return res.status(200).json({
      success: true,
      data: {
        totalRoutesExecuted,
        totalBinsCollected,
        averageRouteDistance,
        estimatedFuelSavings,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };
