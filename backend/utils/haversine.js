function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const φ1 = toRadians(Number(lat1));
  const φ2 = toRadians(Number(lat2));
  const Δφ = toRadians(Number(lat2) - Number(lat1));
  const Δλ = toRadians(Number(lon2) - Number(lon1));

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

module.exports = { calculateDistance };
