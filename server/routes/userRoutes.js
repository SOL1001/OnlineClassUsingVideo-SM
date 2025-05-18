// const express = require("express");
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
//   getTeacherInfo,
//   getStudentInfo,
//   getAllTeachers,
//   getAllStudents,
//   updateAvatar,
// } = require("../controllers/userController");
// const upload = require("../middleware/upload");
// const { protect } = require("../middleware/authMiddleware");
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
  updateAvatar,
  getMyAvatar,
} = require("../controllers/userController");
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/authMiddleware"); // ✅ Fixed

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post("/register", registerUser);
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);
router.get("/get/avatar", protect, getMyAvatar);

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
