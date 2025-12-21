const Food = require("../models/food.model");
const FoodPartner = require("../models/foodpartner.model");
const User = require("../models/user.model");
const Like = require("../models/likes.model");
const Save = require("../models/save.model");
const Comment = require("../models/comment.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const Order = require("../models/order.model");

/* ====================== CREATE FOOD ====================== */
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    const upload = await storageService.uploadFile(req.file.buffer, uuid());

    const food = await Food.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      foodPartner: req.user._id,
      video: upload.url,
      likeCount: 0,
      savesCount: 0,
      commentsCount: 0,
    });

    res.status(201).json({ success: true, food });
  } catch (err) {
    console.error("Create food error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ====================== FETCH FOOD FEED ====================== */
async function getFoodItems(req, res) {
  try {
    const { search = "", category = "All", onlyFollowed = "false" } = req.query;

    const query = {};

    // Search
    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // Category
    if (category !== "All") {
      query.category = category;
    }

    // Follow filter only if user exists
    if (onlyFollowed === "true") {
      if (!req.user || !Array.isArray(req.user.following)) {
        return res.json({ foodItems: [] });
      }
      query.foodPartner = { $in: req.user.following };
    }

    const foods = await Food.find(query)
      .populate("foodPartner", "name phone orderLinks")
      .sort({ createdAt: -1 });

    res.json({ foodItems: foods });
  } catch (err) {
  console.error("❌ getFoodItems FULL ERROR:", err);
  return res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}

}


/* ====================== FOOD PARTNER PUBLIC PAGE ====================== */
async function getFoodPartnerDetails(req, res) {
  try {
    const partner = await FoodPartner.findById(req.params.id).select("-password");
    if (!partner) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foods = await Food.find({ foodPartner: partner._id })
      .populate("foodPartner", "name phone orderLinks")
      .sort({ createdAt: -1 });

    res.json({ success: true, partner, foods });
  } catch (err) {
    console.error("Partner page error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ====================== LIKE FOOD ====================== */
async function likeFood(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { foodId } = req.body;

  const exists = await Like.findOne({ user: req.user._id, food: foodId });

  if (exists) {
    await Like.deleteOne({ _id: exists._id });
    await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
    return res.json({ liked: false });
  }

  await Like.create({ user: req.user._id, food: foodId });
  await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

  res.json({ liked: true });
}

/* ====================== SAVE FOOD ====================== */
async function saveFood(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { foodId } = req.body;

  const exists = await Save.findOne({ user: req.user._id, food: foodId });

  if (exists) {
    await Save.deleteOne({ _id: exists._id });
    await Food.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
    return res.json({ saved: false });
  }

  await Save.create({ user: req.user._id, food: foodId });
  await Food.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

  res.json({ saved: true });
}

/* ====================== COMMENTS ====================== */
async function addComment(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { foodId, text } = req.body;

    const comment = await Comment.create({
      food: foodId,
      user: req.user._id,
      text,
    });

    await Food.findByIdAndUpdate(foodId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false });
  }
}

async function getComments(req, res) {
  try {
    const comments = await Comment.find({ food: req.params.foodId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false });
  }
}

/* ====================== FOLLOW / UNFOLLOW ====================== */
async function followPartner(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { partnerId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: partnerId },
  });

  await FoodPartner.findByIdAndUpdate(partnerId, {
    $addToSet: { followers: req.user._id },
  });

  res.json({ success: true });
}

async function unfollowPartner(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { partnerId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: partnerId },
  });

  await FoodPartner.findByIdAndUpdate(partnerId, {
    $pull: { followers: req.user._id },
  });

  res.json({ success: true });
}

async function getMyUploads(req, res) {
  const foods = await Food.find({
    foodPartner: req.user._id
  }).sort({ createdAt: -1 });

  res.json({ foods });
}

async function getOrderAnalytics(req, res) {
  try {
    const partnerId = req.user._id;

    const orders = await Order.find({
      foodPartner: partnerId,
      status: "completed"
    });

    let totalOrders = orders.length;
    let totalRevenue = 0;

    for (const order of orders) {
      totalRevenue += order.totalAmount;
    }

    res.json({
      totalOrders,
      totalRevenue
    });

  } catch (err) {
    console.error("Order analytics error:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
}
async function getOrderTrends(req, res) {
  try {
    const partnerId = req.user._id;

    const trends = await Order.aggregate([
      {
        $match: {
          foodPartner: partnerId,
          status: "completed"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    res.json(trends);

  } catch (err) {
    console.error("Order trends error:", err);
    res.status(500).json({ message: "Failed to fetch trends" });
  }
}
/* ====================== EXPORTS ====================== */
module.exports = {
  createFood,
  getFoodItems,
  getFoodPartnerDetails,
  likeFood,
  saveFood,
  addComment,
  getComments,
  followPartner,
  unfollowPartner,
  getMyUploads,
  getOrderAnalytics,
  getOrderTrends
};
