const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  submitGrade,
  getTeacherGrades,
  getStudentGrades,
} = require("../controllers/gradeController");

// Teacher submits grade
router.post("/", protect, submitGrade);

// Teacher views submitted grades
router.get("/teacher", protect, getTeacherGrades);

// Student views their own grade
router.get("/student", protect, getStudentGrades);

module.exports = router;
