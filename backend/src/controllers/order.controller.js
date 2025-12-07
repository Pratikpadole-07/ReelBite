const Order = require("../models/order.model")
const Food = require("../models/food.model")

exports.createOrder = async (req, res) => {
  try {
    const { foodId, method } = req.body

    const food = await Food.findById(foodId).populate("foodPartner")
    if (!food) return res.status(404).json({ message: "Food not found" })

    const order = await Order.create({
      food: foodId,
      user: req.user._id,
      partner: food.foodPartner._id,
      method,
      status: "pending"
    })

    res.status(201).json({ success: true, order })
  } catch (err) {
    console.error("Create Order Error:", err)
    res.status(500).json({ success: false })
  }
}

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

exports.updateStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const updated = await Order.findOneAndUpdate(
    { _id: id, partner: req.foodPartner._id },
    { status },
    { new: true }
  )

  if (!updated) return res.status(404).json({ message: "Order not found" })

  res.json({ success: true, updated })
}
