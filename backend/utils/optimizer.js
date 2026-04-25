const { calculateDistance } = require("./haversine");

function getCoords(bin) {
  if (!bin || typeof bin !== "object") return null;
  if (typeof bin.lat === "number" && typeof bin.lng === "number") {
    return { lat: bin.lat, lng: bin.lng };
  }
  if (typeof bin.lat === "number" && typeof bin.lon === "number") {
    return { lat: bin.lat, lng: bin.lon };
  }
  if (
    bin.location &&
    typeof bin.location.lat === "number" &&
    typeof bin.location.lng === "number"
  ) {
    return { lat: bin.location.lat, lng: bin.location.lng };
  }
  return null;
}

function distanceBetween(a, b) {
  const ca = getCoords(a);
  const cb = getCoords(b);
  if (!ca || !cb) return Number.POSITIVE_INFINITY;
  return calculateDistance(ca.lat, ca.lng, cb.lat, cb.lng);
}

function routeDistance(route) {
  if (!Array.isArray(route) || route.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += distanceBetween(route[i], route[i + 1]);
  }
  return total;
}

function nearestNeighbor(bins) {
  const remaining = bins.slice();
  const ordered = [];

  ordered.push(remaining.shift());

  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < remaining.length; i++) {
      const d = distanceBetween(last, remaining[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }

  return ordered;
}

function twoOpt(route, maxIterations = 50) {
  if (!Array.isArray(route) || route.length < 4) return route;

  let best = route.slice();
  let bestDistance = routeDistance(best);

  for (let iter = 0; iter < maxIterations; iter++) {
    let improved = false;

    for (let i = 1; i < best.length - 2; i++) {
      for (let k = i + 1; k < best.length - 1; k++) {
        const newRoute = best
          .slice(0, i)
          .concat(best.slice(i, k + 1).reverse(), best.slice(k + 1));

        const newDistance = routeDistance(newRoute);
        if (newDistance + 1e-9 < bestDistance) {
          best = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }

    if (!improved) break;
  }

  return best;
}

function optimizeRoute(bins) {
  if (!Array.isArray(bins)) {
    throw new TypeError("optimizeRoute expects an array of bins");
  }
  if (bins.length === 0) {
    return { optimizedBins: [], totalDistance: 0 };
  }

  const greedy = nearestNeighbor(bins);
  const optimizedBins = twoOpt(greedy);
  const totalDistance = routeDistance(optimizedBins);

  return { optimizedBins, totalDistance };
}

module.exports = { optimizeRoute };
