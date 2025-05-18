const express = require("express");
const router = express.Router();
const {
  createClass,
  getMyClasses,
  getAllClasses,
} = require("../controllers/videoClassController");

const { protect } = require("../middleware/authMiddleware"); // assumes auth is set up

// Teacher creates a class
router.post("/create", protect, createClass);

// Teacher gets their own classes
router.get("/my-classes", protect, getMyClasses);

// Students (or anyone) view all scheduled classes
router.get("/all", protect, getAllClasses);

module.exports = router;
