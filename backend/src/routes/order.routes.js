const express = require("express");
const router = express.Router();

/* CONTROLLERS */
const {
  createOrder,
  getUserOrders,
  getPartnerOrders,
  updateOrderStatus
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

module.exports = router;
