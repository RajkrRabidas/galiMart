const shopModel = require("../models/shop.model");
const shopMenuModel = require("../models/shopMenu.model");
const shopMenuModel = require("../models/shopMenu.model");
const uploadCloudinary = require("../utils/cloudinary");

const addMenuItem = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const shop = await shopModel.findOne({ ownerId: req.user._id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const { name, description, price, category } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "please give image" });
  }

  const cloudinaryUrl = await uploadCloudinary(file.path);

  if (!cloudinaryUrl) {
    return res.status(500).json({ message: "Filed to upload image" });
  }

  const meniItem = await shopMenuModel.create({
    name,
    description,
    image: cloudinaryUrl,
    price,
    shopId: shop._id,
    category,
    isAvailable: true,
  });
  res
    .status(201)
    .json({ message: "Menu item added successfully", menuItem: meniItem });
};

const getAllMenuItems = async (req, res) => {
  const { id: shopId } = req.params;

  if (!shopId) {
    return res.status(400).json({ message: "Shop ID is required" });
  }

  const menuItem = await shopMenuModel.find({ shopId });
  res.json({
    message: "Menu items retrieved successfully",
    menuItems: menuItem,
  });
};

const deleteMenuItem = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  const item = await shopMenuModel.findById({ itemId });

  if (!item) {
    return res.status(404).json({ message: "no Item found" });
  }

  const shop = await shopModel.findOne({
    _id: item.shopId,
    ownerId: req.user._id,
  });

  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  await item.deleteOne()

  res.json({message:"item delete successfully"})
};

const toggleMenuItemAvailable = async (req, res) => {
    if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  const item = await shopMenuModel.findById({ itemId });

  if (!item) {
    return res.status(404).json({ message: "no Item found" });
  }

  const shop = await shopModel.findOne({
    _id: item.shopId,
    ownerId: req.user._id,
  });

  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  item.isAvailable = !item.isAvailable

  await item.save()

  res.json({message: `item mark as ${item.isAvailable ? "available":"Unavailable"}, item`})

}


module.exports = {
  addMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  toggleMenuItemAvailable
};
