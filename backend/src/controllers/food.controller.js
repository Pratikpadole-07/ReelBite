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
    const foodItems = await foodModel.find()
      .populate("foodPartner", "name address phone city")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, foodItems });
  } catch (err) {
    console.error("Error fetching food:", err);
    res.status(500).json({ success: false, message: "Server Error" });
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
  getMyUploads
};
