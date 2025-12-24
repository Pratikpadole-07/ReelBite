const express = require("express");
const router = express.Router();

/* CONTROLLERS */
const {
  createOrder,
  getUserOrders,
  getPartnerOrders,
  updateOrderStatus,
  getPartnerDashboardStats,
  getPartnerOrderAnalytics
} = require("../controllers/order.controller");

/* MIDDLEWARES */
const {
  authUserMiddleware,
  authFoodPartnerMiddleware
} = require("../middlewares/auth.middleware");

/* ================= USER ROUTES ================= */
router.post("/", authUserMiddleware, createOrder);
router.get("/my", authUserMiddleware, getUserOrders);

/* ================= PARTNER ROUTES ================= */
router.get("/partner", authFoodPartnerMiddleware, getPartnerOrders);
router.patch("/status", authFoodPartnerMiddleware, updateOrderStatus);
router.get(
  "/partner/stats",
  authFoodPartnerMiddleware,
  getPartnerDashboardStats
);
router.get(
  "/partner/analytics",
  authFoodPartnerMiddleware,
  getPartnerOrderAnalytics
);


module.exports = router;
