// controllers/authController.js
// ─────────────────────────────────────────────
//  Authentication Controllers
//
//  signup  →  POST /api/auth/signup
//  login   →  POST /api/auth/login
//  getMe   →  GET  /api/auth/me  (optional, protected)
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate a signed JWT ─────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ── Helper: build a safe user object (no password) ──
const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

// ─────────────────────────────────────────────
//  @route   POST /api/auth/signup
//  @desc    Register a new user
//  @access  Public
// ─────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ── Basic input validation ─────────────────
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password.",
      });
    }

    // ── Check for existing user ────────────────
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "Email" : "Username";
      return res.status(409).json({
        success: false,
        message: `${field} is already registered. Please use a different one.`,
      });
    }

    // ── Create user (password hashed by pre-save hook) ──
    const user = await User.create({ username, email, password });

    // ── Issue JWT ──────────────────────────────
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error); // passed to errorHandler middleware
  }
};

// ─────────────────────────────────────────────
//  @route   POST /api/auth/login
//  @desc    Log in and receive a JWT
//  @access  Public
// ─────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Basic input validation ─────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // ── Fetch user with password field included ──
    // password has select:false in schema, so we must explicitly include it
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      // Generic message prevents email enumeration attacks
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Compare passwords ──────────────────────
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Issue JWT ──────────────────────────────
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
//  @route   GET /api/auth/me
//  @desc    Get currently authenticated user
//  @access  Protected (requires valid JWT)
// ─────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe };