const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")
const intent = require("../controllers/orderIntent.controller")

router.post("/", auth.authUserMiddleware, intent.createIntent)
router.get("/analytics", auth.authFoodPartnerMiddleware, intent.analytics)
router.get("/trends", auth.authFoodPartnerMiddleware, intent.getOrderTrends)

module.exports = router
