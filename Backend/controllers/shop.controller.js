const shopModel = require("../models/shop.model");
const uploadCloudinary = require("../utils/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { getJson, setJson, clearPattern } = require("../services/redis");
const {
  createShopSchema,
  updateShopSchema,
  updateShopStatusSchema,
} = require("../config/zod");
const {
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  SHOP_ALREADY_EXISTS,
  SHOP_NOT_FOUND,
  INVALID_STATUS,
  MISSING_REQUIRED_FIELDS,
  MISSING_IMAGE,
  MISSING_AADHAAR_IMAGE,
  IMAGE_UPLOAD_FAILED,
  FILE_BUFFER_FAILED,
  SHOP_UPDATED_SUCCESSFULLY,
  SHOP_CREATED_SUCCESSFULLY,
  SHOP_STATUS_UPDATED_SUCCESSFULLY,
  SHOP_VERIFIED_SUCCESSFULLY,
  SHOP_REJECTED_SUCCESSFULLY,
  INVALID_VERIFICATION_ACTION,
  SHOP_NOT_APPROVED,
  PHONE_ALREADY_EXISTS,
  AADHAAR_NUMBER_ALREADY_EXISTS,
} = require("../constants/messages");
const messages = require("../constants/messages");
const { success } = require("zod");
const getMyShop = async (req, res) => {
  try {
    const owner = req.user.id;

    const shop = await shopModel.findOne({
    ownerId: req.user._id,
});
    if (!shop) {
      return res.status(404).json({
        message: "No shop found",
        shop: null,
      });
    }

    return res.status(200).json({
      message: "Shop fetched successfully",
      shop,
    });

  } catch (error) {
    console.error("Get My Shop Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const sendError = (res, statusCode, message, details) => {
  return res
    .status(statusCode)
    .json({ success: false, message, ...(details ? { details } : {}) });
};

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const getNearbyShopCacheKey = ({ latitude, longitude, radius = 5000, search = "" }) => {
  return `shops:nearby:${Number(latitude)}:${Number(longitude)}:${Number(radius)}:${String(search).trim().toLowerCase()}`;
};

const CreateShop = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return sendError(res, 401, UNAUTHORIZED);
  }

  const existingShop = await shopModel.findOne({ ownerId: user._id });

  if (existingShop) {
    return sendError(res, 400, SHOP_ALREADY_EXISTS);
  }

  const validation = createShopSchema.safeParse(req.body);

  if (!validation.success) {
    return sendError(
      res,
      400,
      MISSING_REQUIRED_FIELDS,
      validation.error.issues,
    );
  }

  const {
    name,
    description,
    phone,
    latitude,
    longitude,
    formattedAddress,
    aadharNumber,
    shopType,
  } = validation.data;

  const imageFile = req.files?.image?.[0];
  const aadharFile = req.files?.aadharImage?.[0];

  if (!imageFile) {
    return sendError(res, 400, MISSING_IMAGE);
  }

  if (!aadharFile) {
    return sendError(res, 400, MISSING_AADHAAR_IMAGE);
  }

  const cloudinaryUrl = await uploadCloudinary(imageFile);
  const aadharImageUrl = await uploadCloudinary(aadharFile);

  if (!cloudinaryUrl || !aadharImageUrl) {
    return sendError(res, 500, IMAGE_UPLOAD_FAILED);
  }

  const existingPhoneShop = await shopModel.findOne({ phone: Number(phone) });
  if (existingPhoneShop) {
    return sendError(res, 400, PHONE_ALREADY_EXISTS);
  }

  const existingAadharShop = await shopModel.findOne({ aadharNumber });
  if (existingAadharShop) {
    return sendError(res, 400, AADHAAR_NUMBER_ALREADY_EXISTS);
  }

  const newShop = await shopModel.create({
    name,
    description,
    image: cloudinaryUrl,
    ownerId: user._id,
    phone: Number(phone),
    aadharNumber,
    aadharImage: aadharImageUrl,
    shopType,
    isOpen: false,
    isVerified: false,
    autoLocation: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
      formattedAddress: formattedAddress,
    },
  });

  await clearPattern("shops:nearby:*");
  await clearPattern(`shop:owner:${String(user._id)}`);

  return sendSuccess(res, 201, SHOP_CREATED_SUCCESSFULLY, newShop);
});

const fetchMyShop = asyncHandler(async (req, res) => {
  if(!req.user) {
    return sendError(res, 401, UNAUTHORIZED);
  }

  const ownerKey = `shop:owner:${String(req.user._id)}`;
  const cachedShop = await getJson(ownerKey);

  if (cachedShop) {
    return res.json(cachedShop);
  }

  const shop = await shopModel.findOne({ ownerId: req.user._id });

  if (!shop) {
    return sendError(res, 404, SHOP_NOT_FOUND);
  }

  await setJson(ownerKey, shop, 600);

  if(!req.shopId){
    const token = jwt.sign({ user: {...req.user, shopId: shop._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  return res.json(shop)
});

const updateStatusShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const { status } = req.body;
  const validation = updateShopStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return sendError(res, 400, INVALID_STATUS, validation.error.issues);
  }

  const shop = await shopModel.findOne({ _id: shopId, ownerId: req.user._id });

  if (!shop) {
    return sendError(res, 404, SHOP_NOT_FOUND);
  }

  if (status === true && shop.status !== "approved") {
    return sendError(res, 403, SHOP_NOT_APPROVED);
  }

  const updatedShop = await shopModel.findOneAndUpdate(
    { _id: shopId, ownerId: req.user._id },
    { isOpen: status },
    { returnDocument: 'after' },
  );

  await clearPattern("shops:nearby:*");
  await clearPattern(`shop:owner:${String(req.user._id)}`);

  return sendSuccess(res, 200, SHOP_STATUS_UPDATED_SUCCESSFULLY, updatedShop);
});

const updateShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const validation = updateShopSchema.safeParse(req.body);

  if (!validation.success) {
    return sendError(
      res,
      400,
      MISSING_REQUIRED_FIELDS,
      validation.error.issues,
    );
  }

  const {
    name,
    description,
    latitude,
    longitude,
    formattedAddress,
  } = validation.data;
  const existingShop = await shopModel.findOne({
    _id: shopId,
    ownerId: req.user._id,
  });

  if (!existingShop) {
    return sendError(res, 404, SHOP_NOT_FOUND);
  }

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  // handle location update when latitude and longitude provided
  if (latitude !== undefined && longitude !== undefined) {
    updateData.autoLocation = {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)],
      formattedAddress: formattedAddress || existingShop.autoLocation?.formattedAddress,
    };
  } else if (formattedAddress !== undefined) {
    updateData['autoLocation.formattedAddress'] = formattedAddress;
  }

  const updatedShop = await shopModel.findOneAndUpdate(
    { _id: shopId, ownerId: req.user._id },
    updateData,
    { returnDocument: 'after' },
  );

  await clearPattern("shops:nearby:*");
  await clearPattern(`shop:owner:${String(req.user._id)}`);

  return sendSuccess(res, 200, SHOP_UPDATED_SUCCESSFULLY, updatedShop);
});

const getNearByShop = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius, search = "" } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  const normalizedRadius = Number(radius) || 5000;
  const cacheKey = getNearbyShopCacheKey({ latitude, longitude, radius: normalizedRadius, search });
  const cachedShop = await getJson(cacheKey);

  if (cachedShop) {
    return res.json({ success: true, count: cachedShop.length, shop: cachedShop });
  }

  const query = {
    isVerified: true,
  };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const shop = await shopModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: "distance",
        maxDistance: Number(radius),
        spherical: true,
        query,
      },
    },
    {
      $sort: {
        isOpen: -1,
        distance: 1,
      },
    },
    {
      $addFields: {
        distanceKm: {
          $round: [{ $divide: ["$distance", 1000] }, 2],
        },
      },
    },
  ]);

  await setJson(cacheKey, shop, 180);

  res.json({ success: true, count: shop.length, shop });
});

const verifyShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return sendError(res, 400, INVALID_VERIFICATION_ACTION);
  }

  const shop = await shopModel.findById(shopId);
  if (!shop) {
    return sendError(res, 404, SHOP_NOT_FOUND);
  }

  const isVerified = action === "approve";
  const status = isVerified ? "approved" : "rejected";

  const updatedShop = await shopModel.findByIdAndUpdate(
    shopId,
    { status, isVerified },
    { returnDocument: 'after' },
  );

  return sendSuccess(
    res,
    200,
    isVerified ? SHOP_VERIFIED_SUCCESSFULLY : SHOP_REJECTED_SUCCESSFULLY,
    updatedShop,
  );
});

const fetchSingleShop = asyncHandler(async (req, res) => {
  const shop = await shopModel.findById(req.params.id);

  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  res.json({ success: true, shop });
});

module.exports = {
  CreateShop,
  fetchMyShop,
  updateStatusShop,
  updateShop,
  getNearByShop,
  getMyShop,
  fetchSingleShop,
  verifyShop,
};
