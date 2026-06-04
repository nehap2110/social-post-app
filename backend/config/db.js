// config/db.js
// ─────────────────────────────────────────────
//  MongoDB Atlas connection via Mongoose
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options silence deprecation warnings in Mongoose 7+
      // (already defaults in Mongoose 8, kept here for clarity)
    });

    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    // Exit process with failure so the server doesn't run without a DB
    process.exit(1);
  }
};

module.exports = connectDB;