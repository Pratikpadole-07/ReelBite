const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {authUserMiddleware,authFoodPartnerMiddleware }= require("../middlewares/auth.middleware");
const { commentLimiter } = require("../middlewares/rateLimit.middleware");

const {
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

} = require("../controllers/food.controller");

// FEED
router.get("/", getFoodItems);

// FOOD PARTNER PUBLIC PAGE
router.get("/partner/:id", getFoodPartnerDetails);

// CREATE FOOD (PARTNER)
router.post(
  "/create",
  authFoodPartnerMiddleware,
  upload.single("video"),
  createFood
);


// LIKE / SAVE
router.post("/like", authUserMiddleware, likeFood);
router.post("/save", authUserMiddleware, saveFood);

// COMMENTS
router.post(
  "/comment",
  authUserMiddleware,
  commentLimiter,
  addComment
);
router.get("/comments/:foodId", getComments);

// FOLLOW / UNFOLLOW
router.post("/follow", authUserMiddleware, followPartner);
router.post("/unfollow", authUserMiddleware, unfollowPartner);
router.get(
  "/my-uploads",
  authFoodPartnerMiddleware,
  getMyUploads
);

router.get(
  "/analytics",
  authFoodPartnerMiddleware,
  getOrderAnalytics
);

router.get(
  "/analytics/trends",
  authFoodPartnerMiddleware,
  getOrderTrends
);


module.exports = router;
