const express = require("express");
const router = express.Router();
const { getTeacherDashboard } = require("../controllers/dashboardController");

// GET /api/dashboard/teacher
router.get("/teacher", getTeacherDashboard);

module.exports = router;
