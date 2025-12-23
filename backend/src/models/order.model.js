const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "completed", "rejected"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
