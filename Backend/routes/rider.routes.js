const express = require("express")

const {isAuth} = require("../middlewares/auth.middleware")
const uploadFile = require("../middlewares/multer.middleware")
const {addRidderProfile, fetchMyProfile, toggleRiderAvailability,acceptOrder, fetchMyCrrentOrder, fetchAvailableOrders, updateOrderStatus} = require("../controllers/rider.controller")

const router = express.Router()

router.post(
	"/add/profile",
	isAuth,
	uploadFile.fields([
		{ name: "image", maxCount: 2 },
		{ name: "aadharImage", maxCount: 2 },
	]),
	addRidderProfile,
)
router.get("/myprofile", isAuth, fetchMyProfile)
router.patch("/toggle-availability", isAuth, toggleRiderAvailability)
router.post("/accept/:orderId", isAuth, acceptOrder)
router.get("/order/current", isAuth, fetchMyCrrentOrder)
router.get("/order/available", isAuth, fetchAvailableOrders)
router.put("/order/update/:orderId", isAuth, updateOrderStatus)


module.exports = router