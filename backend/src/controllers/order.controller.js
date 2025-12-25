const Order = require("../models/order.model");
const Food = require("../models/food.model");
const mongoose = require("mongoose");
const { getIO } = require("../socket");

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
    const orders = await Order.find({
      partner: req.user._id
    })
      .populate("food", "name price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error("GET PARTNER ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch partner orders" });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ message: "orderId and status required" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const validTransitions = {
    pending: ["accepted", "rejected"],
    accepted: ["preparing"],
    preparing: ["completed"]
  };

  const allowed = validTransitions[order.status];
  if (!allowed || !allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status transition" });
  }

  // 🔥 CRITICAL FIX
  if (!order.statusHistory) {
    order.statusHistory = [];
  }

  order.status = status;
  order.statusHistory.push({
    status,
    at: new Date()
  });

  await order.save();

  const io = getIO();

  io.to(`user:${order.user}`).emit("order-status-updated", {
    orderId: order._id,
    status,
    at: new Date()
  });

  io.to(`partner:${order.partner}`).emit("order-status-updated", {
    orderId: order._id,
    status,
    at: new Date()
  });

  res.json(order);
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
      {
        $match: { partner: partnerId, status: "completed" }
      },
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
