const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");
const foodPartnerModel = require("../models/foodpartner.model");
const Comment = require("../models/comment.model");

// ====================== CREATE FOOD ======================
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    const uploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      foodPartner: req.user._id,  // ✔ FIXED
      video: uploadResult.url
    });

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      food: foodItem
    });
  } catch (err) {
    console.error("Create food error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// ====================== FETCH FOOD FEED ======================
async function getFoodItems(req, res) {
  try {
    const onlyFollowed = req.query.onlyFollowed === "true";
    let filter = {};

    if (onlyFollowed && req.user) {
      filter.foodPartner = { $in: req.user.following || [] };
    }

    const userId = req.user?._id;

    const foodItems = await foodModel.find(filter)
      .populate("foodPartner", "name address phone city")
      .sort({ createdAt: -1 });

    let results = foodItems.map(f => ({
      ...f.toObject(),
      _likedByMe: false,
      _savedByMe: false
    }));

    if (userId) {
      const likes = await likeModel.find({ user: userId, food: { $in: foodItems.map(f => f._id) } });
      const saves = await saveModel.find({ user: userId, food: { $in: foodItems.map(f => f._id) } });

      const likedIds = new Set(likes.map(l => l.food.toString()));
      const savedIds = new Set(saves.map(s => s.food.toString()));

      results = results.map(f => ({
        ...f,
        _likedByMe: likedIds.has(f._id.toString()),
        _savedByMe: savedIds.has(f._id.toString())
      }));
    }

    res.status(200).json({ success: true, foodItems: results });
  } catch (err) {
    console.error("Error fetching food:", err);
    res.status(500).json({ success: false });
  }
}


// ====================== FOOD PARTNER DETAILS ======================
async function getFoodPartnerDetails(req, res) {
  try {
    const partner = await foodPartnerModel
      .findById(req.params.id)
      .select("-password");

    if (!partner) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foods = await foodModel.find({ foodPartner: partner._id })
      .populate("foodPartner", "name address phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, partner, foods });
  } catch (err) {
    console.error("Food partner error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ====================== LIKE FOOD ======================
async function likeFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const exists = await likeModel.findOne({ user: user._id, food: foodId });

  if (exists) {
    await likeModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
    return res.status(200).json({ like: false });
  }

  await likeModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

  res.status(200).json({ like: true });
}

// ====================== SAVE FOOD ======================
async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const exists = await saveModel.findOne({ user: user._id, food: foodId });

  if (exists) {
    await saveModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
    return res.status(200).json({ save: false });
  }

  await saveModel.create({ user: user._id, food: foodId });
  await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

  res.status(200).json({ save: true });
}

// ====================== COMMENTS ======================
async function addComment(req, res) {
  try {
    const { foodId, text } = req.body;

    const newComment = await Comment.create({
      food: foodId,
      user: req.user._id,
      text
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { commentsCount: 1 }
    });

    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false });
  }
}

async function getComments(req, res) {
  try {
    const comments = await Comment.find({ food: req.params.foodId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false });
  }
}

// ====================== SAVED FOODS ======================
async function getSaveFood(req, res) {
  const savedFoods = await saveModel.find({ user: req.user._id }).populate("food");
  res.status(200).json({ savedFoods });
}

// ====================== MY UPLOADS ======================
async function getMyUploads(req, res) {
  try {
    const foods = await foodModel.find({ foodPartner: req.user._id }) // ✔ FIXED
      .populate("foodPartner", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, foods });
  } catch (err) {
    console.error("My uploads error:", err);
    res.status(500).json({ success: false });
  }
}

// ====================== UPDATE FOOD ======================
async function updateFood(req, res) {
  const updateData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    orderLink: req.body.orderLink,
  };

  if (req.file) {
    const uploadResult = await storageService.uploadFile(req.file.buffer, uuid());
    updateData.video = uploadResult.url;
  }

  const updated = await foodModel.findOneAndUpdate(
    { _id: req.params.id, foodPartner: req.user._id }, // ✔ FIXED
    updateData,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Not allowed or not found" });

  res.json({ success: true, updated });
}

// ====================== DELETE FOOD ======================
async function deleteFood(req, res) {
  const deleted = await foodModel.findOneAndDelete({
    _id: req.params.id,
    foodPartner: req.user._id, // ✔ FIXED
  });

  if (!deleted) return res.status(404).json({ message: "Not allowed or not found" });

  res.json({ success: true, message: "Food deleted" });
}
// ====================== FOLLOW PARTNER ======================
async function followPartner(req, res) {
  try {
    const userId = req.user._id;
    const { partnerId } = req.body;

    // Add only if not already followed
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { following: partnerId }
    });

    await foodPartnerModel.findByIdAndUpdate(partnerId, {
      $addToSet: { followers: userId }
    });

    res.status(200).json({ success: true, followed: true });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ success: false });
  }
}

// ====================== UNFOLLOW PARTNER ======================
async function unfollowPartner(req, res) {
  try {
    const userId = req.user._id;
    const { partnerId } = req.body;

    await userModel.findByIdAndUpdate(userId, {
      $pull: { following: partnerId }
    });

    await foodPartnerModel.findByIdAndUpdate(partnerId, {
      $pull: { followers: userId }
    });

    res.status(200).json({ success: true, followed: false });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ success: false });
  }
}
async function getRecommendedFeed(req, res){
  try {
    const user = req.user;

    const followingIds = user.following || [];

    const foods = await foodModel
      .find({ foodPartner: { $in: followingIds } })
      .populate("foodPartner", "name")
      .sort({ createdAt: -1 });

    const categoryPrefs = await likeModel.aggregate([
      { $match: { user: user._id } },
      {
        $lookup: {
          from: "foods",
          localField: "food",
          foreignField: "_id",
          as: "food"
        }
      },
      { $unwind: "$food" },
      {
        $group: {
          _id: "$food.category",
          likes: { $sum: 1 }
        }
      }
    ]);

    const categoryMap = {};
    categoryPrefs.forEach(c => {
      categoryMap[c._id] = c.likes;
    });

    const scored = foods.map(f => {
      const categoryScore = categoryMap[f.category] || 0;
      const recencyBonus = Math.max(0, 10 - Math.floor((Date.now() - new Date(f.createdAt)) / 86400000));

      return {
        ...f._doc,
        _score: f.likeCount * 2 + f.savesCount * 3 + categoryScore * 4 + recencyBonus
      };
    });

    scored.sort((a, b) => b._score - a._score);

    res.json({ success: true, recommended: scored.slice(0, 20) });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ success: false });
  }
};


module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  addComment,
  getComments,
  getFoodPartnerDetails,
  getSaveFood,
  deleteFood,
  updateFood,
  getMyUploads,
  followPartner,
  unfollowPartner,
  getRecommendedFeed

};
