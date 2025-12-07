const OrderIntent = require("../models/orderIntent.model")
const Food = require("../models/food.model")

exports.createIntent = async (req, res) => {
  try {
    const { foodId, method } = req.body
    if (!foodId || !method) return res.status(400).json({ message: "Missing fields" })

    const food = await Food.findById(foodId).populate("foodPartner")
    if (!food) return res.status(404).json({ message: "Food not found" })

    const intent = await OrderIntent.create({
      user: req.user._id,
      food: food._id,
      partner: food.foodPartner._id,
      method
    })

    res.status(201).json({ success: true, intent })
  } catch (err) {
    console.error("Create intent error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

exports.analytics = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id

    const data = await OrderIntent.aggregate([
      { $match: { partner: partnerId } },
      { $group: { _id: "$method", count: { $sum: 1 } } }
    ])

    res.json({ success: true, data })
  } catch (err) {
    console.error("Analytics error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getOrderTrends = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id

    const data = await OrderIntent.aggregate([
      { $match: { partner: partnerId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({ success: true, data })
  } catch (err) {
    console.error("Trend error:", err)
    res.status(500).json({ success: false })
  }
}
