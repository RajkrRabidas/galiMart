const express = require("express")

const {isAuth} = require("../middlewares/auth.middleware")
const {fetchMyProfile, toggleRiderAvailability} = require("../controllers/rider.controller")

const router = express.Router()

router.get("/myprofile", isAuth, fetchMyProfile)
router.patch("/toggle-availability", isAuth, toggleRiderAvailability)

module.exports = router