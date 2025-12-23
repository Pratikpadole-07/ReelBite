const rateLimit = require("express-rate-limit");

/* ---------------- LOGIN LIMIT ---------------- */
// 5 attempts per 10 minutes
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Try again after 10 minutes."
    });
  }
});

/* ---------------- ORDER INTENT LIMIT ---------------- */
// 20 per hour
const orderIntentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many order intents. Slow down."
    });
  }
});

/* ---------------- COMMENT LIMIT ---------------- */
// 10 per minute
const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Commenting too fast. Take a breath."
    });
  }
});

module.exports = {
  loginLimiter,
  orderIntentLimiter,
  commentLimiter
};
