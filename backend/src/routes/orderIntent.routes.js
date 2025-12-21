// src/routes/orderIntent.routes.js
const express = require("express");
const router = express.Router();
const { authFoodPartnerMiddleware } = require("../middlewares/auth.middleware");
const {
  createOrderIntent,
  getPartnerOrderIntents,
  getPartnerOrderAnalytics
} = require("../controllers/orderIntent.controller");

// user creates intent
router.post("/", require("../middlewares/auth.middleware").authUserMiddleware, createOrderIntent);

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
