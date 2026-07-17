const express = require("express");
const { isAuth, isSeller } = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/multer.middleware");
const {
  addMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  toggleMenuItemAvailable,
} = require("../controllers/menuItem.controller");

const router = express();

router.post(
  "/new-menu",
  isAuth,
  isSeller,
  uploadFile.single("image"),
  addMenuItem,
);
router.get("/all/:id", isAuth, isSeller, getAllMenuItems);
router.delete("/:id", isAuth, isSeller, deleteMenuItem);
router.delete("/status/:id", isAuth, isSeller, toggleMenuItemAvailable);

module.exports = router;
