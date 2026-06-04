// models/Post.js
// ─────────────────────────────────────────────
//  Post Schema
//  Fields: author, text, image, likes, comments, timestamps
//
//  Business rules enforced at schema level:
//   • A post must have text OR image (validated in controller)
//   • Likes store user ObjectId + username → enables duplicate prevention
//   • Comments store user ObjectId + username + text + timestamp
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

// ── Sub-schema: Like ───────────────────────────
const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { _id: false } // No separate _id for each like entry
);

// ── Sub-schema: Comment ────────────────────────
const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // Each comment gets its own _id so it can be deleted later
);

// ── Main Post Schema ───────────────────────────
const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Display name snapshotted at post-creation time so feed stays
    // consistent even if a user changes their username later
    authorUsername: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: [1000, "Post text cannot exceed 1000 characters"],
      default: "",
    },

    // Stores the filename/path returned by Multer; empty string = no image
    image: {
      type: String,
      default: "",
    },

    // Array of { user, username } objects
    likes: {
      type: [LikeSchema],
      default: [],
    },

    // Array of comment objects
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ── Virtual: likeCount ─────────────────────────
// Convenient computed field; not stored in DB
PostSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// ── Virtual: commentCount ──────────────────────
PostSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Include virtuals when converting to JSON (useful for API responses)
PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Post", PostSchema);