const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("mama"),
    foodController.createFood)


/* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)

router.get('/partner/:id',
    authMiddleware.authUserMiddleware,
    foodController.getFoodPartnerDetails
);

router.post("/comment",
  authMiddleware.authUserMiddleware,
  foodController.addComment
);

router.get("/:foodId/comments",
  authMiddleware.authUserMiddleware,
  foodController.getComments
);

// Update Food Item
router.put('/:id',
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("mama"),
  foodController.updateFood
);

// Delete Food Item
router.delete('/:id',
  authMiddleware.authFoodPartnerMiddleware,
  foodController.deleteFood
);

// Food Partner Dashboard List
router.get('/my-foods',
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getMyFoods
);



module.exports = router