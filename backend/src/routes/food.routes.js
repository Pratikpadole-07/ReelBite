const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const {
  authUserMiddleware,
  authFoodPartnerMiddleware,
} = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

/* CREATE FOOD (Partner) */
router.post(
  "/create",
  authFoodPartnerMiddleware,
  upload.single("file"),
  foodController.createFood
);

/* GET ALL FOOD ITEMS (For Users) */
router.get("/food", authUserMiddleware, foodController.getFoodItems);

/* LIKE FOOD */
router.post("/like", authUserMiddleware, foodController.likeFood);

/* SAVE FOOD */
router.post("/save", authUserMiddleware, foodController.saveFood);
router.get("/save", authUserMiddleware, foodController.getSaveFood);

/* GET FOOD PARTNER DETAILS + THEIR FOODS */
router.get(
  "/partner/:id",
  authUserMiddleware,
  foodController.getFoodPartnerDetails
);

/* COMMENTS */
router.post("/comment", authUserMiddleware, foodController.addComment);
router.get("/:foodId/comments", authUserMiddleware, foodController.getComments);

/* UPDATE FOOD (Partner Only) */
router.put(
  "/:id",
  authFoodPartnerMiddleware,
  upload.single("file"),
  foodController.updateFood
);

/* DELETE FOOD (Partner Only) */
router.delete("/:id", authFoodPartnerMiddleware, foodController.deleteFood);

/* GET MY UPLOADS (Partner Only) */
router.get(
  "/my-uploads",
  authFoodPartnerMiddleware,
  foodController.getMyUploads
);
router.post("/follow",
  auth.middleware.authUserMiddleware,
  foodController.followPartner
);

router.post("/unfollow",
  auth.middleware.authUserMiddleware,
  foodController.unfollowPartner
);

router.get(
  "/food/recommended",
  authMiddleware.authUserMiddleware,
  foodController.getRecommendedFeed
);


module.exports = router;
