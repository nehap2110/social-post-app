// controllers/postController.js
// ─────────────────────────────────────────────
//  Post Controllers
//
//  createPost   →  POST /api/posts
//  getFeed      →  GET  /api/posts
//  likePost     →  PUT  /api/posts/:id/like
//  commentPost  →  POST /api/posts/:id/comment
// ─────────────────────────────────────────────

const Post = require("../models/Post");
const path = require("path");

// ─────────────────────────────────────────────
//  @route   POST /api/posts
//  @desc    Create a new post (text, image, or both)
//  @access  Protected
// ─────────────────────────────────────────────
const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Multer attaches the file (if uploaded) to req.file
    const imageFile = req.file;

    // ── Validation: must have text or image ────
    const hasText = text && text.trim().length > 0;
    const hasImage = !!imageFile;

    if (!hasText && !hasImage) {
      return res.status(400).json({
        success: false,
        message: "A post must contain text, an image, or both.",
      });
    }

    // ── Build image URL ────────────────────────
    // We store the relative path and expose it as a URL the frontend
    // can use directly (served by Express static middleware in server.js).
    let imagePath = "";
    if (hasImage) {
      // e.g.  /uploads/64f3a1b2-1700000000000.jpg
      imagePath = `/uploads/${imageFile.filename}`;
    }

    // ── Create post ────────────────────────────
    const post = await Post.create({
      author: req.user._id,
      authorUsername: req.user.username,
      text: hasText ? text.trim() : "",
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
//  @route   GET /api/posts
//  @desc    Get public feed (all posts, newest first)
//  @access  Public (no auth required to browse)
// ─────────────────────────────────────────────
const getFeed = async (req, res, next) => {
  try {
    // ── Pagination params ──────────────────────
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // ── Query ──────────────────────────────────
    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .populate("author", "username avatar") // join author details
        .lean(), // plain JS objects are faster for read-only responses
      Post.countDocuments(),
    ]);

    // ── Attach extra computed fields ───────────
    const postsWithCounts = posts.map((p) => ({
      ...p,
      likeCount: p.likes.length,
      commentCount: p.comments.length,
    }));

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
//  @route   PUT /api/posts/:id/like
//  @desc    Toggle like on a post (like / unlike)
//  @access  Protected
// ─────────────────────────────────────────────
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const userId = req.user._id.toString();

    // ── Check if already liked ─────────────────
    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.user.toString() === userId
    );

    if (alreadyLikedIndex !== -1) {
      // ── Unlike: remove the like entry ─────────
      post.likes.splice(alreadyLikedIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked.",
        liked: false,
        likeCount: post.likes.length,
        likes: post.likes,
      });
    }

    // ── Like: add a new like entry ─────────────
    post.likes.push({
      user: req.user._id,
      username: req.user.username,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post liked!",
      liked: true,
      likeCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
//  @route   POST /api/posts/:id/comment
//  @desc    Add a comment to a post
//  @access  Protected
// ─────────────────────────────────────────────
const commentPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    // ── Validate comment text ──────────────────
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty.",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 500 characters.",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // ── Build comment object ───────────────────
    const newComment = {
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    // Return the newly added comment (last item in the array)
    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added!",
      comment: addedComment,
      commentCount: post.comments.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getFeed, likePost, commentPost };