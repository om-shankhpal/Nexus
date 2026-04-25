const mongoose = require("mongoose");
const Bin = require("../models/Bin");

function getStatusFromFillLevel(fillLevel) {
  const level = Math.max(0, Math.min(100, Number(fillLevel)));
  if (level <= 30) return "EMPTY";
  if (level <= 70) return "MEDIUM";
  return "FULL";
}

async function createBin(req, res, next) {
  try {
    const { location, fillLevel = 0, lastCollectedAt } = req.body || {};

    const bin = await Bin.create({
      location,
      fillLevel,
      status: getStatusFromFillLevel(fillLevel),
      lastCollectedAt,
    });

    res.status(201).json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
}

async function getAllBins(req, res, next) {
  try {
    const bins = await Bin.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bins });
  } catch (err) {
    next(err);
  }
}

async function updateBinFillLevel(req, res, next) {
  try {
    const { id } = req.params;
    const { fillLevel } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Invalid bin ID");
      e.statusCode = 400;
      throw e;
    }

    if (fillLevel === undefined || fillLevel === null) {
      const e = new Error("fillLevel is required");
      e.statusCode = 400;
      throw e;
    }

    const nextFillLevel = Math.max(0, Math.min(100, Number(fillLevel)));
    if (Number.isNaN(nextFillLevel)) {
      const e = new Error("fillLevel must be a number between 0 and 100");
      e.statusCode = 400;
      throw e;
    }

    const bin = await Bin.findByIdAndUpdate(
      id,
      {
        fillLevel: nextFillLevel,
        status: getStatusFromFillLevel(nextFillLevel),
      },
      { new: true, runValidators: true }
    );

    if (!bin) {
      const e = new Error("Bin not found");
      e.statusCode = 404;
      throw e;
    }

    res.status(200).json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
}

async function deleteBin(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Invalid bin ID");
      e.statusCode = 400;
      throw e;
    }

    const bin = await Bin.findByIdAndDelete(id);
    if (!bin) {
      const e = new Error("Bin not found");
      e.statusCode = 404;
      throw e;
    }

    res.status(200).json({ success: true, message: "Bin deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBin,
  getAllBins,
  updateBinFillLevel,
  deleteBin,
};
