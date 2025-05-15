const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Create assignment with file upload
router.post("/", protect, upload.single("file"), createAssignment);

// Get all assignments
router.get("/", protect, getAllAssignments);

// Get single assignment
router.get("/:id", protect, getAssignment);

// Update assignment with file upload
router.put("/:id", protect, upload.single("file"), updateAssignment);

// Delete assignment
router.delete("/:id", protect, deleteAssignment);

module.exports = router;
