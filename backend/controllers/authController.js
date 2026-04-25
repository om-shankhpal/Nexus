const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const e = new Error("JWT_SECRET is not defined in environment");
    e.statusCode = 500;
    throw e;
  }

  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "7d",
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};

    if (!email || !password || !role) {
      const e = new Error("email, password and role are required");
      e.statusCode = 400;
      throw e;
    }

    if (!["USER", "WORKER"].includes(role)) {
      const e = new Error("role must be USER or WORKER");
      e.statusCode = 400;
      throw e;
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      const e = new Error("Email already registered");
      e.statusCode = 409;
      throw e;
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const e = new Error("email and password are required");
      e.statusCode = 400;
      throw e;
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      const e = new Error("Invalid credentials");
      e.statusCode = 401;
      throw e;
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      const e = new Error("Invalid credentials");
      e.statusCode = 401;
      throw e;
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function loginWorker(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const e = new Error("email and password are required");
      e.statusCode = 400;
      throw e;
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
      role: "WORKER",
    }).select("+password");

    if (!user) {
      const e = new Error("Invalid credentials");
      e.statusCode = 401;
      throw e;
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      const e = new Error("Invalid credentials");
      e.statusCode = 401;
      throw e;
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, loginWorker };

