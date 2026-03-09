const express = require("express");
const { protect } = require("../middlewares/authMiddleware")
const router = express.Router()
const { getEmployerAnalytics } = require("../controllers/analyticsController")

router.get("/my", protect, getEmployerAnalytics);

module.exports = router;