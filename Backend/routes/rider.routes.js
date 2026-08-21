const express = require("express")

const {isAuth} = require("../middlewares/auth.middleware")
const uploadFile = require("../middlewares/multer.middleware")
const {addRidderProfile, fetchMyProfile, toggleRiderAvailability,acceptOrder, fetchMyCrrentOrder, updateOrderStatus} = require("../controllers/rider.controller")

const router = express.Router()

router.post("/add/profile", isAuth, uploadFile.single("image"), addRidderProfile)
router.get("/myprofile", isAuth, fetchMyProfile)
router.patch("/toggle-availability", isAuth, toggleRiderAvailability)
router.post("/accept/:orderId", isAuth, acceptOrder)
router.get("/order/current", isAuth, fetchMyCrrentOrder)
router.put("/order/update/:orderId", isAuth, updateOrderStatus)


module.exports = router