const rateLimit = require("express-rate-limit");

/* ---------------- LOGIN LIMIT ---------------- */
// 5 attempts per 10 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    message: "Too many login attempts. Try again after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* ---------------- ORDER INTENT LIMIT ---------------- */
// 20 intents per hour per user/IP
const orderIntentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    message: "Too many order attempts. Please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* ---------------- COMMENT LIMIT ---------------- */
// 10 comments per minute per user/IP
const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    message: "Commenting too fast. Take a breath."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  orderIntentLimiter,
  commentLimiter
};
