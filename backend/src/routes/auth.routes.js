const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  authUserMiddleware,
  authFoodPartnerMiddleware
} = require("../middlewares/auth.middleware");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/* USER */
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/user/me", authUserMiddleware, authController.getCurrentUser);
router.post(
  "/user/avatar",
  authUserMiddleware,
  upload.single("avatar"),
  authController.updateUserAvatar
);

/* FOOD PARTNER */
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", loginLimiter, authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);
router.get(
  "/food-partner/me",
  authFoodPartnerMiddleware,
  authController.getCurrentFoodPartner
);
router.put(
  "/food-partner/update",
  authFoodPartnerMiddleware,
  upload.single("logo"),
  authController.updateFoodPartnerProfile
);

module.exports = router;
