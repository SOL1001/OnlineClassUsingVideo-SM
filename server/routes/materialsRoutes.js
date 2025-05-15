const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadMaterial,
  getTeacherMaterials,
  getStudentMaterials,
  deleteMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");
// Upload material (Teacher only)
router.post("/upload", protect, upload.single("file"), uploadMaterial);

// Get uploaded materials (Teacher only)
router.get("/teacher", protect, getTeacherMaterials);

// Get all materials for students
router.get("/student", protect, getStudentMaterials);
router.delete("/delete/martial/:id", protect, deleteMaterial);

module.exports = router;
