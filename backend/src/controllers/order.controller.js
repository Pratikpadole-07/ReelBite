const Order = require("../models/order.model");
const Food = require("../models/food.model");
const mongoose = require("mongoose");
const { getIO } = require("../socket");
const { generateOrderExplanation } = require("../services/ai.service");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID required" });
    }

    const food = await Food.findById(foodId).populate("foodPartner");
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const order = await Order.create({
      food: food._id,
      user: req.user._id,
      partner: food.foodPartner._id,
      status: "pending",
      statusHistory: [{ status: "pending", at: new Date() }]
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/* ================= USER ORDERS ================= */
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("food", "name price video")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

/* ================= PARTNER ORDERS ================= */
exports.getPartnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ partner: req.user._id })
      .populate("food", "name price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error("GET PARTNER ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch partner orders" });
  }
};


/* ================= UPDATE ORDER STATUS (SAFE + IDEMPOTENT) ================= */
/* ================= UPDATE ORDER STATUS (SAFE) ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status: nextStatus } = req.body;

    if (!orderId || !nextStatus) {
      return res.status(400).json({ message: "orderId and status required" });
    }

    const validTransitions = {
      pending: ["accepted"],
      accepted: ["preparing"],
      preparing: ["completed"]
    };

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = order.status;
    if (!validTransitions[currentStatus]?.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: currentStatus,
        "statusHistory.status": { $ne: nextStatus }
      },
      {
        $set: { status: nextStatus },
        $push: {
          statusHistory: { status: nextStatus, at: new Date() }
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ message: "No state change" });
    }

    // 🔥 SEND RESPONSE FIRST
    res.json(updatedOrder);

    // 🔥 SOCKET SHOULD NEVER BREAK API
    try {
      const io = getIO();
      const last = updatedOrder.statusHistory.at(-1);

      io.to(`user:${updatedOrder.user}`).emit("order-status-updated", {
        orderId: updatedOrder._id,
        status: nextStatus,
        at: last.at
      });

      io.to(`partner:${updatedOrder.partner}`).emit("order-status-updated", {
        orderId: updatedOrder._id,
        status: nextStatus,
        at: last.at
      });
    } catch (socketErr) {
      console.error("Socket emit failed:", socketErr.message);
    }

  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Internal error" });
  }
};

/* ================= DASHBOARD STATS ================= */
exports.getPartnerDashboardStats = async (req, res) => {
  try {
    const partnerId = req.user._id;

    const totalOrders = await Order.countDocuments({ partner: partnerId });

    const activeOrders = await Order.countDocuments({
      partner: partnerId,
      status: { $in: ["pending", "accepted", "preparing"] }
    });

    res.json({ totalOrders, activeOrders });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

/* ================= ANALYTICS ================= */
exports.getPartnerOrderAnalytics = async (req, res) => {
  try {
    const partnerId = new mongoose.Types.ObjectId(req.user._id);

    const totalOrders = await Order.countDocuments({ partner: partnerId });

    const completedOrders = await Order.countDocuments({
      partner: partnerId,
      status: "completed"
    });

    const revenueAgg = await Order.aggregate([
      { $match: { partner: partnerId, status: "completed" } },
      {
        $lookup: {
          from: "foods",
          localField: "food",
          foreignField: "_id",
          as: "food"
        }
      },
      { $unwind: "$food" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$food.price" }
        }
      }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({ totalOrders, completedOrders, totalRevenue });
  } catch (err) {
    console.error("PARTNER ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};


exports.explainOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("food", "name")
      .populate("user", "_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔒 strict user-only access
    if (String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ deterministic explanation (NO AI CALL)
    const explanation =
      generateOrderExplanation(order) ||
      "Explanation unavailable at the moment.";

    return res.json({ explanation });
  } catch (err) {
    console.error("Explain order error:", err.message);
    return res
      .status(500)
      .json({ message: "Failed to generate explanation" });
  }
};
