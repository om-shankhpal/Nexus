const express = require("express");
const { register, login, loginWorker } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/worker/login", loginWorker);

module.exports = router;

