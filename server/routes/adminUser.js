const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUser
} = require("../controllers/adminController");

// Get all users with search, filter, pagination
router.get("/", getAllUsers);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

// Update user by ID
router.put("/:id", updateUser);

module.exports = router;
