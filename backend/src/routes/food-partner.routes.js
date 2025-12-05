const express=require('express');
const authUserMiddleware = require("../middlewares/auth.middleware");
const foodPartnerController = require("../controllers/food-partner.controller");

const router=express.Router();

router.get("/:id",
    authUserMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById
)

module.exports=router;
