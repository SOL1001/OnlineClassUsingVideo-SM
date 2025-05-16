const User = require("../models/User");
const mongoose = require("mongoose"); // ✅ Add this line


// GET all users with search, filter, pagination
const getAllUsers = async (req, res) => {
  try {
    let { search = "", role, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = {};

    if (role) filter.role = role;

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
      users,
    });
  } catch (err) {
    console.error("Get users failed:", err);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// DELETE a user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user failed:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// UPDATE a user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user: updated });
  } catch (err) {
    console.error("Update user failed:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
};
