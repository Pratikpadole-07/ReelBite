const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Delivered"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);