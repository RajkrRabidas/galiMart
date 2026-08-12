const shopModel = require("../models/shop.model");
const uploadCloudinary = require("../utils/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
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
    isOpen: false,
    isVerified: false,
    autoLocation: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
      formattedAddress: formattedAddress,
    },
  });

  return sendSuccess(res, 201, SHOP_CREATED_SUCCESSFULLY, newShop);
});

const fetchMyShop = asyncHandler(async (req, res) => {
  if(!req.user) {
    return sendError(res, 401, UNAUTHORIZED);
  }

  const shop = await shopModel.findOne({ ownerId: req.user._id });

  if (!shop) {
    return sendError(res, 404, SHOP_NOT_FOUND);
  }

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
    { new: true },
  );

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
    phone,
    latitude,
    longitude,
    formattedAddress,
    aadharNumber,
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

  if (phone !== undefined) {
    const existingPhoneShop = await shopModel.findOne({
      phone: Number(phone),
      _id: { $ne: shopId },
    });

    if (existingPhoneShop) {
      return sendError(res, 400, PHONE_ALREADY_EXISTS);
    }

    updateData.phone = Number(phone);
  }

  if (aadharNumber !== undefined) {
    const existingAadharShop = await shopModel.findOne({
      aadharNumber,
      _id: { $ne: shopId },
    });

    if (existingAadharShop) {
      return sendError(res, 400, AADHAAR_NUMBER_ALREADY_EXISTS);
    }

    updateData.aadharNumber = aadharNumber;
    updateData.status = "pending";
    updateData.isVerified = false;
  }

  if (
    latitude !== undefined ||
    longitude !== undefined ||
    formattedAddress !== undefined
  ) {
    const nextLatitude =
      latitude ?? existingShop.autoLocation?.coordinates?.[1];
    const nextLongitude =
      longitude ?? existingShop.autoLocation?.coordinates?.[0];
    const nextFormatted =
      formattedAddress ?? existingShop.autoLocation?.formattedAddress;

    updateData.autoLocation = {
      type: "Point",
      coordinates: [Number(nextLongitude), Number(nextLatitude)],
      formattedAddress: nextFormatted,
    };
  }

  const aadharFile = req.files?.aadharImage?.[0];
  if (aadharFile) {
    const aadharImageUrl = await uploadCloudinary(aadharFile);
    if (!aadharImageUrl) {
      return sendError(res, 500, IMAGE_UPLOAD_FAILED);
    }
    updateData.aadharImage = aadharImageUrl;
    updateData.status = "pending";
    updateData.isVerified = false;
  }

  const imageFile = req.files?.image?.[0];
  if (imageFile) {
    const cloudinaryUrl = await uploadCloudinary(imageFile);

    if (!cloudinaryUrl) {
      return sendError(res, 500, IMAGE_UPLOAD_FAILED);
    }

    updateData.image = cloudinaryUrl;
  }

  const updatedShop = await shopModel.findOneAndUpdate(
    { _id: shopId, ownerId: req.user._id },
    updateData,
    { new: true },
  );

  return sendSuccess(res, 200, SHOP_UPDATED_SUCCESSFULLY, updatedShop);
});

const getNearByShop = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius, search = "" } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
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
    { new: true },
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
