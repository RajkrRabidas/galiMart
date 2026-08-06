const express = require("express")
const { isAuth, isSeller, isAdmin } = require("../middlewares/auth.middleware")
const uploadFile = require("../middlewares/multer.middleware")
const {
  CreateShop,
  updateStatusShop,
  updateShop,
  getNearByShop,
  fetchSingleShop,
  getMyShop,
  verifyShop,
} = require("../controllers/shop.controller")

const router = express()

router.post(
  "/create-shop",
  isAuth,
  isSeller,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
  ]),
  CreateShop,
)
router.put(
  "/edit/:shopId",
  isAuth,
  isSeller,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
  ]),
  updateShop,
)
router.put("/update-shop-status/:shopId", isAuth, isSeller, updateStatusShop)
router.put("/verify/:shopId", isAuth, isAdmin, verifyShop)
router.get("/get-nearby-shops", isAuth, getNearByShop)
router.get("/getAll/:id", isAuth, fetchSingleShop)
router.get("/my-shop", isAuth, getMyShop);

module.exports = router