// routes/authRoutes.js
// ─────────────────────────────────────────────
//  Authentication Routes
//
//  POST /api/auth/signup  →  register
//  POST /api/auth/login   →  login
//  GET  /api/auth/me      →  get current user (protected)
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;