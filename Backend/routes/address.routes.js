const express = require("express")
const { isAuth } = require("../middlewares/auth.middleware")
const { addAddress, deleteAddress, getMyAddress} = require("../controllers/address.controller")

const router = express()

router.post("/new", isAuth, addAddress)
router.delete("/delete/:id", isAuth, deleteAddress)
router.get("/my-address", isAuth, getMyAddress)


module.exports = router