const mongoose = require("mongoose");

const orderIntentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPartner",
      required: true,
    },
    method: {
      type: String,
      enum: ["zomato", "swiggy", "call", "website"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orderintent", orderIntentSchema);
