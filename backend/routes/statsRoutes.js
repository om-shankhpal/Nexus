const express = require("express");
const { getAnalytics } = require("../controllers/statsController");

const router = express.Router();

router.get("/", getAnalytics);

module.exports = router;
