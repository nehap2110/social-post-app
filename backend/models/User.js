// models/User.js
// ─────────────────────────────────────────────
//  User Schema
//  Fields: username, email, password (hashed), avatar, timestamps
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // Never return the password field in query results by default
      select: false,
    },

    // Optional profile picture (stored as URL path or filename)
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Pre-save Hook ──────────────────────────────
// Hash the password before saving whenever it is new or modified
UserSchema.pre("save", async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12); // cost factor 12 is a solid balance
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method ────────────────────────────
// Compare a plain-text password against the stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);