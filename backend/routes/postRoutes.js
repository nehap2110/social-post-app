// routes/postRoutes.js
// ─────────────────────────────────────────────
//  Post Routes
//
//  POST /api/posts              →  create post  (protected)
//  GET  /api/posts              →  public feed  (public)
//  PUT  /api/posts/:id/like     →  toggle like  (protected)
//  POST /api/posts/:id/comment  →  add comment  (protected)
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  likePost,
  commentPost,
} = require("../controllers/postController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ── Public ─────────────────────────────────────
router.get("/", getFeed);

// ── Protected ──────────────────────────────────
// upload.single("image") runs BEFORE createPost so req.file is available.
// The field name "image" must match what the frontend sends in FormData.
router.post("/", protect, upload.single("image"), createPost);

router.put("/:id/like", protect, likePost);

router.post("/:id/comment", protect, commentPost);

module.exports = router;