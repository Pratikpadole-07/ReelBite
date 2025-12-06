const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


// User routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);
router.post(
  "/user/avatar",
  authMiddleware.authUserMiddleware,
  upload.single("avatar"),
  authController.updateUserAvatar
);

router.get("/user/me", authMiddleware.authUserMiddleware, async (req, res) => {
  const user = await userModel.findById(req.user._id).select("-password");
  res.json({ user });
});


// Food partner routes
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);

router.get(
  "/food-partner/me",
  authMiddleware.authFoodPartnerMiddleware,
  async (req, res) => {
    try {
      const partner = await foodPartnerModel
        .findById(req.foodPartner._id)
        .select("-password");

      res.json({ foodPartner: partner });
    } catch (err) {
      console.error("Get partner error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);



module.exports = router;
