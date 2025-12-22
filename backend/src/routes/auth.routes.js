const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const {
  authUserMiddleware,
  authFoodPartnerMiddleware
} = require("../middlewares/auth.middleware");

const { loginLimiter } = require("../middlewares/rateLimit.middleware")

const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/* ================= USER ROUTES ================= */

// Register user
router.post("/user/register", authController.registerUser);

// Login user
router.post("/user/login",loginLimiter, authController.loginUser);

// Logout user
router.get("/user/logout", authController.logoutUser);

// Upload avatar
router.post(
  "/user/avatar",
  authUserMiddleware,
  upload.single("avatar"),
  authController.updateUserAvatar
);

// Get current user
router.get("/user/me", authUserMiddleware, async (req, res) => {
  const user = await userModel.findById(req.user._id).select("-password");
  res.json({ user });
});

/* ================= FOOD PARTNER ROUTES ================= */

// Register partner
router.post("/food-partner/register", authController.registerFoodPartner);

// Login partner
router.post("/food-partner/login",loginLimiter, authController.loginFoodPartner);

// Logout partner
router.get("/food-partner/logout", authController.logoutFoodPartner);

// Get current partner
router.get(
  "/food-partner/me",
  authFoodPartnerMiddleware,
  async (req, res) => {
    const partner = await foodPartnerModel
      .findById(req.user._id)
      .select("-password");

    if (!partner) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ foodPartner: partner });
  }
);

// Update partner profile
router.put(
  "/food-partner/update",
  authFoodPartnerMiddleware,
  upload.single("logo"),
  authController.updateFoodPartnerProfile
);
console.log("AUTH CONTROLLER:", authController);

module.exports = router;
