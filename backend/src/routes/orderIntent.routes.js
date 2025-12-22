// src/routes/orderIntent.routes.js
const express = require("express");
const router = express.Router();
const { authUserMiddleware,authFoodPartnerMiddleware } = require("../middlewares/auth.middleware");
const {
  createOrderIntent,
  getPartnerOrderIntents,
  getPartnerOrderAnalytics
} = require("../controllers/orderIntent.controller");
const { orderIntentLimiter } = require("../middlewares/rateLimit.middleware")
// user creates intent
router.post(
  "/",
  authUserMiddleware,
  orderIntentLimiter,
  createOrderIntent
);

// partner dashboard
router.get(
  "/partner",
  authFoodPartnerMiddleware,
  getPartnerOrderIntents
);
router.get(
  "/analytics",
  authFoodPartnerMiddleware,
  getPartnerOrderAnalytics
);

module.exports = router;
