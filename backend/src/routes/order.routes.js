const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")
const order = require("../controllers/order.controller")

router.post("/", auth.authUserMiddleware, order.createOrder)
router.get("/user", auth.authUserMiddleware, order.getUserOrders)
router.get("/partner", auth.authFoodPartnerMiddleware, order.getPartnerOrders)
router.patch("/:id", auth.authFoodPartnerMiddleware, order.updateStatus)

module.exports = router
