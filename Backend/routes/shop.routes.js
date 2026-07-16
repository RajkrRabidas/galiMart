const express = require("express")
const {isAuth, isSeller } = require("../middlewares/auth.middleware")
const uploadFile = require("../middlewares/multer.middleware")
const {CreateShop} = require("../controllers/shop.controller")

const router = express()


router.post("/create-shop", isAuth, isSeller, uploadFile.single("image"), CreateShop)


module.exports = router