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

/* ================= UPDATE ORDER STATUS (IDEMPOTENT) ================= */
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status: nextStatus } = req.body;

  if (!orderId || !nextStatus) {
    return res.status(400).json({ message: "orderId and status required" });
  }

  const validTransitions = {
    pending: ["accepted", "rejected"],
    accepted: ["preparing"],
    preparing: ["completed"]
  };

  // 1️⃣ Read current state
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const currentStatus = order.status;
  const allowed = validTransitions[currentStatus] || [];

  if (!allowed.includes(nextStatus)) {
    return res.status(400).json({ message: "Invalid status transition" });
  }

  // 2️⃣ Atomic + idempotent update
  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: orderId,
      status: currentStatus,
      "statusHistory.status": { $ne: nextStatus }
    },
    {
      $set: { status: nextStatus },
      $push: {
        statusHistory: {
          status: nextStatus,
          at: new Date()
        }
      }
    },
    { new: true }
  );

  // 3️⃣ No-op (duplicate request / retry)
  if (!updatedOrder) {
    const fresh = await Order.findById(orderId);
    return res.json({ message: "No state change", order: fresh });
  }

  // 4️⃣ Emit realtime update
  const io = getIO();
  const lastEntry = updatedOrder.statusHistory.at(-1);

  io.to(`user:${updatedOrder.user}`).emit("order-status-updated", {
    orderId: updatedOrder._id,
    status: nextStatus,
    at: lastEntry.at
  });

  io.to(`partner:${updatedOrder.partner}`).emit("order-status-updated", {
    orderId: updatedOrder._id,
    status: nextStatus,
    at: lastEntry.at
  });

  res.json(updatedOrder);
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
