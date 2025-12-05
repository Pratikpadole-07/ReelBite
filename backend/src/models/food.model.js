const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    },
    category: {
        type: String,
        enum: ["Pizza", "Burger", "Desserts", "Drinks", "South Indian", "Chinese", "Other"],
        default: "Other"
    },
    price: {
        type: Number,
        default: null,
    },
    location: {
        type: String,
        default: "Not Available"
    },
    orderLinks: {
        zomato: { type: String, default: null },
        swiggy: { type: String, default: null },
        website: { type: String, default: null },
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;
