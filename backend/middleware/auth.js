const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");

    if (!token) {
      const e = new Error("Not authorized, token missing");
      e.statusCode = 401;
      throw e;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const e = new Error("JWT_SECRET is not defined in environment");
      e.statusCode = 500;
      throw e;
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      const e = new Error("Not authorized");
      e.statusCode = 401;
      throw e;
    }

    req.user = { id: user._id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const e = new Error("Forbidden");
      e.statusCode = 403;
      return next(e);
    }
    next();
  };
}

module.exports = { protect, authorize };

