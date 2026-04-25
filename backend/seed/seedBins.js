const connectDB = require("../config/db");
const Bin = require("../models/Bin");

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randBetween(min, max + 1));
}

function getStatusFromFillLevel(fillLevel) {
  if (fillLevel <= 30) return "EMPTY";
  if (fillLevel <= 70) return "MEDIUM";
  return "FULL";
}

function randomLocationAround({ lat, lng }, jitter = 0.08) {
  return {
    lat: Number((lat + randBetween(-jitter, jitter)).toFixed(6)),
    lng: Number((lng + randBetween(-jitter, jitter)).toFixed(6)),
  };
}

function randomDateWithinDays(days) {
  const now = Date.now();
  const past = now - randomInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

async function seedBins() {
  await connectDB();

  console.log("Connected. Seeding bins...");

  const deleted = await Bin.deleteMany({});
  console.log(`Deleted existing bins: ${deleted.deletedCount ?? 0}`);

  const pune = { lat: 18.5204, lng: 73.8567 };
  const sambhajiNagar = { lat: 19.8762, lng: 75.3433 };
  const centers = [pune, sambhajiNagar];

  const bins = Array.from({ length: 60 }).map(() => {
    const center = centers[randomInt(0, centers.length - 1)];
    const fillLevel = randomInt(0, 100);
    return {
      location: randomLocationAround(center),
      fillLevel,
      status: getStatusFromFillLevel(fillLevel),
      lastCollectedAt: randomDateWithinDays(30),
    };
  });

  const inserted = await Bin.insertMany(bins);
  console.log(`Inserted bins: ${inserted.length}`);
  console.log("Seeding completed successfully.");
}

seedBins()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err?.message ?? err);
    process.exit(1);
  });
