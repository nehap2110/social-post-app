// middleware/errorHandler.js
// ─────────────────────────────────────────────
//  Centralized Error Handler
//
//  Express calls this when next(err) is invoked anywhere in the app,
//  or when an unhandled error bubbles up from a route handler.
//  Must be registered LAST in server.js (after all routes).
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Default to 500 unless the error already carries a status code
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: Cast Error ───────────────────
  // Happens when an invalid ObjectId is passed (e.g. /posts/not-an-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate Key ────────────────
  // Code 11000 = unique index violation (e.g. duplicate email / username)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already taken.`;
  }

  // ── Mongoose: Validation Error ─────────────
  // Collects all field-level validation messages into one response
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  // ── JWT Errors ─────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // ── Multer Errors ──────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum allowed size is 5 MB.";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected field name in file upload.";
  }

  // ── Send response ──────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development mode for easier debugging
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;