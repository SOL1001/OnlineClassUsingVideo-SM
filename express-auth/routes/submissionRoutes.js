const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getTeacherSubmissions,
  getAssignmentSubmissions,
  getStudentSubmissions,
  submitAssignment,
  gradeSubmission,
} = require("../controllers/submissionController");

// Teacher routes
router.get("/teacher", protect, getTeacherSubmissions);
router.get("/assignment/:assignmentId", protect, getAssignmentSubmissions);
router.put("/:submissionId/grade", protect, gradeSubmission);

// Student routes
router.get("/student", protect, getStudentSubmissions);
router.post(
  "/:assignmentId/submit",
  protect,
  upload.single("file"),
  submitAssignment
);

module.exports = router;
