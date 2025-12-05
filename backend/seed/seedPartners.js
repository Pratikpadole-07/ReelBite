const mongoose = require("mongoose");
const FoodPartner = require("../src/models/foodpartner.model");
const bcrypt = require("bcryptjs");

const MONGO_URI = "mongodb://localhost:27017/reelbite";

const partners = [
  {
    name: "Pizza Palace",
    contactName: "Rahul Shah",
    phone: "9876543210",
    address: "Akurdi Chowk",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411044",
    email: "pizza@palace.com",
    password: bcrypt.hashSync("pizza123", 10),
    orderLinks: {
      zomato: "https://zomato.com/pizzapalace",
      swiggy: "https://swiggy.com/pizzapalace"
    }
  },
  {
    name: "Burger Hub",
    contactName: "Riya Mehta",
    phone: "9988776655",
    address: "FC Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411016",
    email: "burger@hub.com",
    password: bcrypt.hashSync("burger123", 10),
    orderLinks: {
      zomato: "https://zomato.com/burgerhub",
      swiggy: "https://swiggy.com/burgerhub"
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("📡 MongoDB Connected");

    await FoodPartner.deleteMany(); 
    await FoodPartner.insertMany(partners);

    console.log("🏪 Partners Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
