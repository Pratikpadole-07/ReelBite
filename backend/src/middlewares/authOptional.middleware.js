const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authOptional(req, res, next) {
  try {
    const token = req.cookies.user_token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") return next();

    const user = await User.findById(decoded.id).select("following");
    if (user) req.user = user;
  } catch {
    // silent fail
  }

  next();
}

module.exports = authOptional;
