// middleware/upload.js
// ─────────────────────────────────────────────
//  Multer – Image Upload Configuration
//
//  Strategy: store on local disk under /uploads/
//  In production you would swap diskStorage for an S3/Cloudinary
//  storage engine, but disk storage is perfect for local dev & demos.
// ─────────────────────────────────────────────

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Ensure upload directory exists ─────────────
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Disk Storage Engine ────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Build a collision-resistant filename:
    //   <userId>-<timestamp>.<ext>
    //   e.g.  64f3a1b2c3d4e5f6a7b8c9d0-1700000000000.jpg
    const userId = req.user ? req.user._id : "anon";
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${userId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// ── File Filter ────────────────────────────────
// Allow only common image MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept
  } else {
    cb(
      new Error("Only image files (jpeg, png, gif, webp) are allowed."),
      false // reject
    );
  }
};

// ── Multer Instance ────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum
  },
});

module.exports = upload;