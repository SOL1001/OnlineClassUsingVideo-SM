// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Username is required"],
//       trim: true,
//       minlength: [3, "Username must be at least 3 characters long"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/.+@.+\..+/, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//     },
//     role: {
//       type: String,
//       enum: ["teacher", "student", "admin"],
//       default: "student",
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//     lastLogin: {
//       type: Date,
//       default: Date.now,
//     },
//     avatar: {
//       type: String,
//       default: "", // You can store a filename or URL here
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Method to compare password during login
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
