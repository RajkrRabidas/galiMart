const Rider = require("../models/rider.model");
const orderModel = require("../models/order");
const Shop = require("../models/shop.model");
const { emitRealtimeEvent } = require("../services/realtime.service");
const { getIO } = require("../services/socket");
const { createStoredPayoutDetails, toPublicPayoutDetails } = require("../utils/payoutDetails");

const addShopDetails = async (orders) => {
  const shopIds = [...new Set(orders.map((order) => order.shopId).filter(Boolean))];
  if (shopIds.length === 0) return orders;

  const shops = await Shop.find({ _id: { $in: shopIds } }).select("phone autoLocation").lean();
  const shopById = new Map(shops.map((shop) => [shop._id.toString(), shop]));

  return orders.map((order) => {
    const data = order.toObject ? order.toObject() : order;
    const shop = shopById.get(String(data.shopId));
    const shopCoordinates = shop?.autoLocation?.coordinates;
    const pickupLocation =
      data.pickupLocation ||
      (shopCoordinates && shopCoordinates.length === 2
        ? { lat: shopCoordinates[1], lng: shopCoordinates[0] }
        : null);

    return {
      ...data,
      shopPhone: data.shopPhone || (shop?.phone ? String(shop.phone) : null),
      pickupAddress: data.pickupAddress || shop?.autoLocation?.formattedAddress || null,
      pickupLocation,
      shopLocation: data.shopLocation || pickupLocation,
    };
  });
};

const addRidderProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "Unauthorized" });
  }

  if (user.role !== "rider") {
    return res.status(403).json({
      message: "Only riders can create rider profile",
    });
  }

  const profileFile = req.files?.image?.[0];
  const aadharFile = req.files?.aadharImage?.[0];

  if (!profileFile || !aadharFile) {
    return res.status(400).json({ message: "Rider image is required" });
  }

  const fs = require("fs").promises;
  const path = require("path");

  const uploadsDir = path.join(__dirname, "../uploads/riders");
  let uploadResult;

  try {
    await fs.mkdir(uploadsDir, { recursive: true });

    const profileFileName = `${Date.now()}-${profileFile.originalname}`;
    const aadharFileName = `${Date.now()}-aadhar-${aadharFile.originalname}`;
    const profileFilePath = path.join(uploadsDir, profileFileName);
    const aadharFilePath = path.join(uploadsDir, aadharFileName);

    await fs.writeFile(profileFilePath, profileFile.buffer);
    await fs.writeFile(aadharFilePath, aadharFile.buffer);

    uploadResult = {
      profilePath: `/uploads/riders/${profileFileName}`,
      aadharImagePath: `/uploads/riders/${aadharFileName}`,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ message: "Error saving file" });
  }

  const {
    name,
    phoneNumber,
    aadharNumber,
    drivingLicenseNumber,
    latitude,
    longitude,
  } = req.body;

  if (
    !name ||
    !phoneNumber ||
    !aadharNumber ||
    !drivingLicenseNumber ||
    !latitude ||
    !longitude
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingRider = await Rider.findOne({ userId: user._id });

  if (existingRider) {
    return res.status(400).json({ message: "Rider profile already exists" });
  }

  try {
    const riderProfile = await Rider.create({
      userId: user._id,
      name: name.trim(),
      picture: uploadResult.profilePath,
      phoneNumber,
      aadharNumber,
      aadharImage: uploadResult.aadharImagePath,
      drivingLicenseNumber,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      isAvailable: false,
      isVerified: false,
    });

    return res
      .status(201)
      .json({ message: "Rider profile created successfully", riderProfile });
  } catch (error) {
    console.error("Error creating rider profile:", error);
    return res.status(500).json({ message: "Error creating rider profile" });
  }
};

const fetchMyProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const riderProfile = await Rider.findOne({ userId: user._id });

    if (!riderProfile) {
      return res.status(404).json({ message: "Rider profile not found" });
    }

    return res.status(200).json({ riderProfile });
  } catch (error) {
    console.error("Error fetching rider profile:", error);
    return res.status(500).json({ message: "Error fetching rider profile" });
  }
};

const getRiderEarningsSummary = async (riderId) => {
  const [summary] = await orderModel.aggregate([
    {
      $match: {
        riderId: String(riderId),
        paymentStatus: "paid",
        status: "delivered",
        settlementStatus: { $nin: ["refunded", "cancelled"] },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: {
          $sum: {
            $cond: [
              { $gt: [{ $ifNull: ["$riderPayout", 0] }, 0] },
              "$riderPayout",
              { $ifNull: ["$riderAmount", 0] },
            ],
          },
        },
        completedDeliveries: { $sum: 1 },
      },
    },
  ]);

  return {
    totalEarnings: summary?.totalEarnings || 0,
    completedDeliveries: summary?.completedDeliveries || 0,
  };
};

const fetchMyEarnings = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const rider = await Rider.findOne({ userId }).select(
    "_id payoutDetails.method payoutDetails.accountHolderName payoutDetails.accountLast4 payoutDetails.upiIdMasked payoutDetails.updatedAt",
  );
  if (!rider) {
    return res.status(404).json({ message: "Rider profile not found" });
  }

  const summary = await getRiderEarningsSummary(rider._id);
  return res.json({
    ...summary,
    payoutEligible: summary.totalEarnings > 0,
    payoutDetails: toPublicPayoutDetails(rider.payoutDetails),
    payoutMethod: "Manual UPI/bank transfer",
  });
};

const saveMyPayoutDetails = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const rider = await Rider.findOne({ userId });
  if (!rider) {
    return res.status(404).json({ message: "Rider profile not found" });
  }

  const summary = await getRiderEarningsSummary(rider._id);
  if (!summary.totalEarnings) {
    return res.status(409).json({ message: "Payout details can be added after your first completed delivery." });
  }

  try {
    rider.payoutDetails = createStoredPayoutDetails(req.body);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
  await rider.save();

  return res.json({
    message: "Payout details saved securely. Transfers will be made manually.",
    payoutDetails: toPublicPayoutDetails(rider.payoutDetails),
  });
};

const toggleRiderAvailability = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "Unauthorized" });
  }

  if (user.role !== "rider") {
    return res.status(403).json({
      message: "Only riders can create rider profile",
    });
  }

  const { isAvailable, isAvailble, latitude, longitude } = req.body;
  const requestedAvailability = isAvailable ?? isAvailble;

  if (typeof requestedAvailability !== "boolean") {
    return res.status(400).json({
      message: "isAvailble must be boolean",
    });
  }

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      message: "loccation is required",
    });
  }

  const rider = await Rider.findOne({
    userId: user._id,
  });

  if (!rider) {
    return res.status(404).json({
      message: "Rider profile not found",
    });
  }

  if (requestedAvailability && !rider.isVerified) {
    return res.status(403).json({
      message: "Rider is not verified yet",
    });
  }

  rider.isAvailable = requestedAvailability;
  rider.location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  };

  rider.lastActiveAt = new Date();

  await rider.save();

  res.json({
    message: requestedAvailability
      ? "Rider is now online"
      : "Rider is now offline",
    rider,
  });
};

const acceptOrder = async (req, res) => {
  const riderUserId = req.user?._id;
  const { orderId } = req.params;

  if (!riderUserId) {
    return res.status(404).json({
      message: "Unauthorized",
    });
  }

  const rider = await Rider.findOne({
    userId: riderUserId,
    isAvailable: true,
  });

  if (!rider) {
    return res.status(404).json({
      message: "Rider profile not found or not available",
    });
  }

  try {
    const orderAvailable = await orderModel.findOne({
      riderId: rider._id,
      status: { $ne: "delivered" },
    });
    if (orderAvailable) {
      return res
        .status(400)
        .json({ message: "You already have an active order" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.riderId) {
      return res.status(400).json({ message: "Order already assigned" });
    }

    order.riderId = rider._id.toString();
    order.riderName = rider.name;
    order.riderPhone = rider.phoneNumber;
    order.status = "rider_assigned";
    await order.save();

    const [enrichedOrder] = await addShopDetails([order]);

    await Rider.findOneAndUpdate(
      { userId: riderUserId, isAvailable: true },
      { isAvailable: false },
      { returnDocument: "after" },
    );

    // Emit socket event to notify all connected riders that this order is taken
    // Broadcast to all clients so any rider viewing the available orders list will see it removed
    const io = getIO();
    io.emit("order:taken_by_rider", {
      orderId: order._id.toString(),
      riderId: rider._id.toString(),
      riderName: rider.name,
    });

    res.json({ message: "Order accepted successfully", success: true, order: enrichedOrder });
  } catch (error) {
    res.status(400).json({
      message: "Error accepting order",
      error: error.message,
    });
  }
};

const fetchMyCrrentOrder = async (req, res) => {
  const riderUserId = req.user?._id;

  if (!riderUserId) {
    return res.status(404).json({ message: "Please login" });
  }

  const rider = await Rider.findOne({ userId: riderUserId, isVerified: true });

  if (!rider) {
    return res.status(404).json({ message: "rider not found" });
  }

  try {
    const orders = await orderModel
      .find({
        riderId: {
          $in: [rider._id.toString(), rider.userId.toString()],
        },
        status: { $ne: "delivered" },
      })
      .sort({ createdAt: -1 });

    res.json({ message: "Current order fetched successfully", orders: await addShopDetails(orders) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching current order", error: error.message });
  }
};

const fetchAvailableOrders = async (req, res) => {
  const riderUserId = req.user?._id;

  if (!riderUserId) {
    return res.status(401).json({ message: "Please login" });
  }

  const rider = await Rider.findOne({ userId: riderUserId, isVerified: true });
  if (!rider) {
    return res.status(404).json({ message: "rider not found" });
  }

  const orders = await orderModel
    .find({
      riderId: null,
      status: "ready_for_rider",
      $or: [
        { paymentStatus: "paid" },
        { paymentMethod: "cod", paymentStatus: "pending" },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(20);

  return res.json({ orders: await addShopDetails(orders) });
};

const updateOrderStatus = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(404).json({ message: "Please login" });
  }

  const rider = await Rider.findOne({ userId: userId });

  if (!rider) {
    return res.status(404).json({ message: "rider not found" });
  }

  const { orderId } = req.params;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.riderId) !== rider._id.toString()) {
      return res.status(403).json({ message: "You are not assigned to this order" });
    }

    if (order.status === "rider_assigned") {
      order.status = "picked_up";
      await order.save();
      emitRealtimeEvent({
        event: "order:rider_assigned",
        room: `shop:${order.shopId}`,
        payload: order,
      });
      emitRealtimeEvent({
        event: "order:rider_assigned",
        room: `user:${order.userId}`,
        payload: order,
      });
      const [enrichedOrder] = await addShopDetails([order]);
      return res.json({ message: "Order status updated successfully", order: enrichedOrder });
    }

    if (order.status === "picked_up") {
      if (order.paymentMethod === "cod" && req.body?.cashCollected !== true) {
        return res.status(400).json({
          message: "Confirm cash collection before completing this COD delivery",
        });
      }

      order.status = "delivered";
      if (order.paymentMethod === "cod") order.paymentStatus = "paid";
      await order.save();
      emitRealtimeEvent({
        event: "order:rider_assigned",
        room: `shop:${order.shopId}`,
        payload: order,
      });
      emitRealtimeEvent({
        event: "order:rider_assigned",
        room: `user:${order.userId}`,
        payload: order,
      });
      const [enrichedOrder] = await addShopDetails([order]);
      return res.json({ message: "Order status updated successfully", order: enrichedOrder });
    }

    return res
      .status(400)
      .json({ message: "Order cannot be updated in this state" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

module.exports = {
  addRidderProfile,
  fetchMyProfile,
  fetchMyEarnings,
  saveMyPayoutDetails,
  toggleRiderAvailability,
  acceptOrder,
  fetchMyCrrentOrder,
  fetchAvailableOrders,
  updateOrderStatus,
};
