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
      commentsCount: 0
    });

    return res.status(201).json({ success: true, food });
  } catch (err) {
    console.error("Create food error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ====================== PAGINATED FEED (NON-REELS) ====================== */
async function getFoodItems(req, res) {
  try {
    const {
      search = "",
      category = "All",
      onlyFollowed = "false",
      page = 1,
      limit = 5
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    if (category !== "All") {
      query.category = category;
    }

    if (onlyFollowed === "true") {
      if (!req.user || !req.user.following?.length) {
        return res.json({ foodItems: [], hasMore: false });
      }
      query.foodPartner = { $in: req.user.following };
    }

    const foods = await Food.find(query)
      .populate("foodPartner", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum + 1);

    const hasMore = foods.length > limitNum;
    if (hasMore) foods.pop();

    return res.json({ foodItems: foods, hasMore });
  } catch (err) {
    console.error("Feed error:", err);
    return res.status(500).json({ message: "Feed failed" });
  }
}

/* ====================== REELS (CURSOR BASED ONLY) ====================== */
async function getReels(req, res) {
  try {
    const {
      cursor,
      limit = 5,
      search = "",
      category = "All",
      onlyFollowed = "false"
    } = req.query;

    const limitNum = Number(limit);
    const query = {};

    // SEARCH
    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // CATEGORY
    if (category !== "All") {
      query.category = category;
    }

    // FOLLOWING
    if (onlyFollowed === "true") {
      if (!req.user || !req.user.following?.length) {
        return res.json({ reels: [], nextCursor: null });
      }
      query.foodPartner = { $in: req.user.following };
    }

    // CURSOR
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const reels = await Food.find(query)
      .sort({ _id: -1 }) // REQUIRED for cursor pagination
      .limit(limitNum + 1)
      .populate("foodPartner", "name logo");

    let nextCursor = null;

    if (reels.length > limitNum) {
      const last = reels.pop();
      nextCursor = last._id;
    }

    return res.json({ reels, nextCursor });
  } catch (err) {
    console.error("Get reels error:", err);
    return res.status(500).json({ message: "Failed to fetch reels" });
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

    return res.json({ success: true, partner, foods });
  } catch (err) {
    console.error("Partner page error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ====================== LIKE ====================== */
async function likeFood(req, res) {
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


/* ====================== SAVE ====================== */
async function saveFood(req, res) {
  const { foodId } = req.body;

  const exists = await Save.findOne({ user: req.user._id, food: foodId });

  if (exists) {
    await Save.deleteOne({ _id: exists._id });
    await Food.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
    return res.json({ saved: false });
  }

  await Save.create({ user: req.user._id, food: foodId });
  await Food.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

  return res.json({ saved: true });
}

/* ====================== SAVED FOODS ====================== */
async function getSavedFoods(req, res) {
  const saved = await Save.find({ user: req.user._id })
    .populate({ path: "food", populate: { path: "foodPartner" } })
    .sort({ createdAt: -1 });

  return res.json({ foods: saved.map(s => s.food) });
}

/* ====================== COMMENTS ====================== */
async function addComment(req, res) {
  const { foodId, text } = req.body;

  const comment = await Comment.create({
    food: foodId,
    user: req.user._id,
    text
  });

  await Food.findByIdAndUpdate(foodId, {
    $inc: { commentsCount: 1 }
  });

  return res.status(201).json({ success: true, comment });
}

async function getComments(req, res) {
  const comments = await Comment.find({ food: req.params.foodId })
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  return res.json({ success: true, comments });
}

/* ====================== FOLLOW ====================== */
async function followPartner(req, res) {
  const { partnerId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: partnerId }
  });

  await FoodPartner.findByIdAndUpdate(partnerId, {
    $addToSet: { followers: req.user._id }
  });

  return res.json({ success: true });
}

async function unfollowPartner(req, res) {
  const { partnerId } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: partnerId }
  });

  await FoodPartner.findByIdAndUpdate(partnerId, {
    $pull: { followers: req.user._id }
  });

  return res.json({ success: true });
}

/* ====================== PARTNER ANALYTICS ====================== */
async function getMyUploads(req, res) {
  const foods = await Food.find({ foodPartner: req.user._id }).sort({
    createdAt: -1
  });

  return res.json({ foods });
}

async function getOrderAnalytics(req, res) {
  const orders = await Order.find({
    foodPartner: req.user._id,
    status: "completed"
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  return res.json({ totalOrders, totalRevenue });
}

async function getOrderTrends(req, res) {
  const trends = await Order.aggregate([
    {
      $match: {
        foodPartner: req.user._id,
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

  return res.json(trends);
}

/* ====================== EXPORTS ====================== */
module.exports = {
  createFood,
  getFoodItems,
  getReels,
  getFoodPartnerDetails,
  likeFood,
  saveFood,
  getSavedFoods,
  addComment,
  getComments,
  followPartner,
  unfollowPartner,
  getMyUploads,
  getOrderAnalytics,
  getOrderTrends
};
