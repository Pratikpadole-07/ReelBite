const OrderIntent = require("../models/orderIntent.model");
const Food = require("../models/food.model");

async function createOrderIntent(req, res) {
  try {
    const { foodId, method } = req.body;

    if (!foodId || !method) {
      return res.status(400).json({ message: "foodId and method required" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const intent = await OrderIntent.create({
      user: req.user._id,
      food: food._id,
      partner: food.foodPartner,
      method
    });

    res.status(201).json({
      success: true,
      intent
    });
  } catch (err) {
    console.error("OrderIntent error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function getPartnerOrderIntents(req, res) {
  try {
    const partnerId = req.user._id;

    const intents = await OrderIntent.find({ partner: partnerId })
      .populate("food", "name")
      .populate("user", "_id")
      .sort({ createdAt: -1 });

    const result = intents.map(i => ({
      id: i._id,
      foodName: i.food?.name || "Deleted food",
      method: i.method,
      time: i.createdAt,
      user: i.user ? `anon_${i.user._id.toString().slice(-4)}` : "anon"
    }));

    res.json({ success: true, intents: result });
  } catch (err) {
    console.error("Partner OrderIntent error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getPartnerOrderAnalytics(req, res) {
  try {
    const partnerId = req.user._id;

    const stats = await OrderIntent.aggregate([
      { $match: { partner: partnerId } },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      zomato: 0,
      swiggy: 0,
      call: 0,
      website: 0
    };

    stats.forEach(s => {
      result[s._id] = s.count;
    });

    res.json({ success: true, analytics: result });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { 
  createOrderIntent,
  getPartnerOrderIntents,
  getPartnerOrderAnalytics
};
