const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["USER", "WORKER"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

