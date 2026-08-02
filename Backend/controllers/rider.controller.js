const Rider = require("../models/rider.model");

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

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Rider image is required" });
  }

  const fs = require("fs").promises;
  const path = require("path");

  const uploadsDir = path.join(__dirname, "../uploads/riders");

  try {
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const uploadResult = {
      filename: fileName,
      path: `/uploads/riders/${fileName}`,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ message: "Error saving file" });
  }

  const {
    phoneNumber,
    aadharNumber,
    aadharImage,
    drivingLicenseNumber,
    latitude,
    longitude,
  } = req.body;

  if (
    !phoneNumber ||
    !aadharNumber ||
    !aadharImage ||
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
      picture: uploadResult.path,
      phoneNumber,
      aadharNumber,
      aadharImage: uploadResult.path,
      drivingLicenseNumber,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      isActive: false,
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

  const { isAvailble, latitude, longitude } = req.body;

  if (typeof isAvailble !== "boolean") {
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

  if (isAvailble && !rider.isVerified) {
    return res.status(403).json({
      message: "Rider is not verified yet",
    });
  }

  rider.isActive = isAvailble;
  rider.location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
  };

  rider.lastActiveAt = new Date();

  await rider.save();

  return res.json({
    message: isAvailble ? "Rider is now online" : "Rider is now offline",
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
    const { data } = await axios.put(
      `${process.env.ORDER_SERVICE_URL}/api/orders/assign/rider`,
      {
        orderId,
        riderId: rider._id.toString(),
        riderUserId: rider.userId,
        riderName: rider.name,
        riderPhone: rider.phoneNumber,
      },
      {
        headers: {
          "x-internal-key": process.env.INTERNAL_KEY,
        },
      },
    );

    if (data?.success) {
      const riderDetails = await Rider.findOneAndUpdate(
        { userId: riderUserId, isAvailable: true },
        { isAvailable: false },
        { new: true },
      );
    }

    res.json({ message: "Order accepted successfully", data });
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

  const rider = await Rider.findOne({ userId: riderUserId, isAvailable: true });

  if (!rider) {
    return res.status(404).json({ message: "rider not found" });
  }

  try {
    const { data } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/api/orders/rider/${rider._id}`,
      {
        headers: {
          "x-internal-key": process.env.INTERNAL_KEY,
        },
      },
    );
    res.json({ message: "Current order fetched successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching current order", error: error.message });
  }
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
    const { data } = await axios.put(
      `${process.env.ORDER_SERVICE_URL}/api/orders/update/rider/${orderId}`,
      { headers: { "x-internal-key": process.env.INTERNAL_KEY } }
    );
    
    res.json({message: "data.message"})
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

module.exports = {
  addRidderProfile,
  fetchMyProfile,
  toggleRiderAvailability,
  acceptOrder,
  fetchMyCrrentOrder,
  updateOrderStatus,
};
