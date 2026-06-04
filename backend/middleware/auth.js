// middleware/auth.js
// ─────────────────────────────────────────────
//  JWT Authentication Middleware
//
//  Attach this to any route that requires a logged-in user.
//  It reads the Bearer token from the Authorization header,
//  verifies it, fetches the user, and attaches it to req.user.
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // ── 1. Extract token ───────────────────────
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // ── 2. Verify token ────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Differentiate between expired and invalid tokens
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    // ── 3. Fetch user from DB ──────────────────
    // We re-fetch from DB (not just trust the payload) so that if an account
    // is deleted, the token is immediately invalidated.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    // ── 4. Attach user to request ──────────────
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

module.exports = { protect };