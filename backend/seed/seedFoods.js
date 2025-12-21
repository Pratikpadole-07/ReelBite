require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("../src/models/food.model");
const FoodPartner = require("../src/models/foodpartner.model");

const MONGO_URI = "mongodb://localhost:27017/reelbite";

async function seedFoods() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    const partner = await FoodPartner.findOne();
    if (!partner) {
      console.log("No Food Partner Found. Register one first.");
      process.exit(1);
    }

    // 🔥 THIS IS THE IMPORTANT PART
    await FoodPartner.findByIdAndUpdate(partner._id, {
      orderLinks: {
        zomato: "https://www.zomato.com",
        swiggy: "https://www.swiggy.com",
        website: "https://example.com"
      }
    });

    await Food.deleteMany();

    await Food.insertMany([
      {
        name: "Cheese Burst Pizza 🍕",
        video: "https://videos.pexels.com/video-files/4114793/4114793-hd_1920_1080_25fps.mp4",
        description: "Loaded with extra cheese & toppings",
        price: 299,
        category: "Pizza",
        foodPartner: partner._id
      },
      {
        name: "Crispy Veg Burger 🍔",
        video: "https://videos.pexels.com/video-files/3209824/3209824-hd_1920_1080_25fps.mp4",
        description: "Crispy patty with sauces",
        price: 149,
        category: "Burger",
        foodPartner: partner._id
      },
      {
        name: "Chocolate Donut 🍩",
        video: "https://videos.pexels.com/video-files/8982415/8982415-hd_1080_1920_30fps.mp4",
        description: "Chocolate glazed donut",
        price: 99,
        category: "Desserts",
        foodPartner: partner._id
      }
    ]);

    console.log("Food reels seeded correctly");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedFoods();
