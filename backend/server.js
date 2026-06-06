// server.js
// ─────────────────────────────────────────────
//  Express Application Entry Point
//
//  Responsibilities:
//   1. Load environment variables
//   2. Connect to MongoDB
//   3. Configure middleware (CORS, JSON parsing, static files)
//   4. Mount routes
//   5. Global error handling
//   6. Start HTTP server
// ─────────────────────────────────────────────

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // must be first so env vars are available below

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middleware/errorHandler");

// ── Connect to MongoDB ─────────────────────────
connectDB();

// ── Create Express App ─────────────────────────
const app = express();

// ─────────────────────────────────────────────
//  Global Middleware
// ─────────────────────────────────────────────

// CORS – allow the React dev server (port 3000) during development.
// In production, restrict origin to your actual domain.
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL || "https://social-post-app-coral.vercel.app"
        : "http://localhost:3000",
    credentials: true, // allow cookies / auth headers
  })
);

// Parse incoming JSON bodies (req.body)
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies (form submissions without files)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Serve uploaded images as static files ──────
// After a file is uploaded to /uploads/<filename>,
// the frontend can access it at  GET /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────

// Health-check endpoint – useful for deployment monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Social App API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Auth routes  →  /api/auth/signup  |  /api/auth/login  |  /api/auth/me
app.use("/api/auth", authRoutes);

// Post routes  →  /api/posts  |  /api/posts/:id/like  |  /api/posts/:id/comment
app.use("/api/posts", postRoutes);

// ── 404 handler for unknown routes ────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─────────────────────────────────────────────
//  Global Error Handler
//  Must be registered AFTER all routes
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀  Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡  API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔍  Health check: http://localhost:${PORT}/api/health\n`);
});

// ── Unhandled Promise Rejections ───────────────
// Catch any async errors that weren't explicitly handled
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...", err.name, err.message);
  process.exit(1);
});