const FoodPartner = require("../models/foodpartner.model");
const Food = require("../models/food.model");

exports.getFoodPartnerById = async (req, res) => {
  try {
    const partner = await FoodPartner.findById(req.params.id)
      .select("-password");

    if (!partner) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foods = await Food.find({ foodPartner: partner._id })
      .sort({ createdAt: -1 });

    res.json({
      partner,
      foods
    });
  } catch (err) {
    console.error("Get partner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
