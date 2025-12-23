const Order = require("../models/order.model")
const Food = require("../models/food.model")

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
      statusHistory: [{ status: "pending" }]
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("food", "name price video")
    .sort({ createdAt: -1 })

  res.json({ success: true, orders })
}

exports.getPartnerOrders = async (req, res) => {
  const orders = await Order.find({ partner: req.foodPartner._id })
    .populate("food", "name price")
    .populate("user", "name email")
    .sort({ createdAt: -1 })

  res.json({ success: true, orders })
}

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

  order.status = status;
  await order.save();

  res.json(order);
};

