const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

async function connectDB() {
  dotenv.config({ path: path.join(__dirname, "..", ".env") });

  const uri = process.env.MONGO_URI;

  try {
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`MongoDB connection error: ${err?.message ?? err}`);
    process.exit(1);
  }
}

module.exports = connectDB;

