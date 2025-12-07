const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String, required: true },
  phone: { type: String, required: true },
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠️ Hash later
  
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  
  logo: { type: String, default: null },
  banner: { type: String, default: null },

  orderLinks: {
    zomato: { type: String, default: null },
    swiggy: { type: String, default: null },
    website: { type: String, default: null }
  },

  foodType: {
    type: String,
    enum: ["Veg", "Non-Veg", "Both"],
    default: "Both"
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  rating: { type: Number, default: 4.0 },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("foodpartner", foodPartnerSchema);
