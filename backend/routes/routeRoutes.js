const express = require("express");
const {
  generateOptimizedRoute,
  getRouteHistory,
} = require("../controllers/routeController");

const router = express.Router();

router.post("/generate", generateOptimizedRoute);
router.get("/history", getRouteHistory);

module.exports = router;
