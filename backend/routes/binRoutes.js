const express = require("express");
const {
  createBin,
  getAllBins,
  updateBinFillLevel,
  deleteBin,
} = require("../controllers/binController");

const router = express.Router();

router.post("/", createBin);
router.get("/", getAllBins);
router.put("/:id", updateBinFillLevel);
router.delete("/:id", deleteBin);

module.exports = router;
