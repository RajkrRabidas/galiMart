const express = require("express")
const {isAuth, isSeller } = require("../middlewares/auth.middleware")
const uploadFile = require("../middlewares/multer.middleware")
const {CreateShop, updateStatusShop, updateShop, getNearByShop, fetchSingleShop , getMyShop} = require("../controllers/shop.controller")

const router = express()


router.post("/create-shop", isAuth, isSeller, uploadFile.single("image"), CreateShop)
router.put("/update-shop-status/:shopId", isAuth, isSeller, updateStatusShop)
router.put("/edit/:shopId", isAuth, isSeller, updateShop)
router.get("/get-nearby-shops", isAuth, getNearByShop)
router.get("/getAll/:id", isAuth, fetchSingleShop)
router.get("/my-shop", isAuth, getMyShop);

module.exports = router