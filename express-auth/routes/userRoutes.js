const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getTeacherInfo,
  getStudentInfo,
  getAllTeachers,
  getAllStudents,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


router.post("/register", registerUser);


router.post("/login", loginUser);


router.get("/teacher/:id", protect, getTeacherInfo);


router.get("/student/:id", protect, getStudentInfo);


// router.get("/teachers", protect, authorize("admin"), getAllTeachers);
router.get(
  "/teachers",
  protect,
  authorize("admin", "student", "teacher"),
  getAllTeachers
);


// router.get("/students", protect, authorize("admin"), getAllStudents);
router.get(
  "/students",
  protect,
  authorize("admin", "student", "teacher"),
  getAllStudents
);

module.exports = router;
