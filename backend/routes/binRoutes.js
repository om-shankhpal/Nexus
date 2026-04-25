const express = require("express");
const {
  createBin,
  getAllBins,
  updateBin,
  deleteBin,
} = require("../controllers/binController");

const router = express.Router();

router.post("/", createBin);
router.get("/", getAllBins);
router.put("/:id", updateBin);
router.delete("/:id", deleteBin);

module.exports = router;
