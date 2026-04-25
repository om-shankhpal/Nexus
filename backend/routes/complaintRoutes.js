const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { createComplaint, getMyComplaints } = require("../controllers/complaintController");

const router = express.Router();

router.use(protect);
router.use(authorize("USER"));

router.post("/", createComplaint);
router.get("/mine", getMyComplaints);

module.exports = router;
