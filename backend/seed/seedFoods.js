const mongoose = require("mongoose");
const Food = require("../src/models/food.model");
const FoodPartner = require("../src/models/foodpartner.model");

const MONGO_URI = "mongodb://localhost:27017/reelbite"; // Change if needed

const sampleFoods = [
  {
    name: "Cheese Burst Pizza 🍕",
    video: "https://videos.pexels.com/video-files/4114793/4114793-hd_1920_1080_25fps.mp4",
    description: "Loaded with extra cheese & delicious toppings!",
    price: 299,
    category: "Pizza",
    orderLink: "https://www.swiggy.com"
  },
  {
    name: "Crispy Veg Burger 🍔",
    video: "https://videos.pexels.com/video-files/3209824/3209824-hd_1920_1080_25fps.mp4",
    description: "Crispy patty with juicy sauces!",
    price: 149,
    category: "Burger",
    orderLink: "https://www.zomato.com"
  },
  {
    name: "Chocolate Donut 🍩",
    video: "https://videos.pexels.com/video-files/8982415/8982415-hd_1080_1920_30fps.mp4",
    description: "Freshly baked filled with chocolate glaze!",
    price: 99,
    category: "Desserts"
  }
];

async function seedFoods() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("📡 MongoDB Connected");

    const partner = await FoodPartner.findOne();
    if (!partner) {
      console.log("⚠ No Food Partner Found! Register one first.");
      process.exit();
    }

    sampleFoods.forEach((item) => (item.foodPartner = partner._id));

    await Food.insertMany(sampleFoods);

    console.log("🍽 Food Reels Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
}

seedFoods();
