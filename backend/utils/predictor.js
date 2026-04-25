function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function predictFillLevel(currentFillLevel) {
  const current = clamp(Number(currentFillLevel) || 0, 0, 100);
  const growth = Math.floor(Math.random() * (20 - 5 + 1)) + 5; // 5..20
  return clamp(current + growth, 0, 100);
}

module.exports = { predictFillLevel };
