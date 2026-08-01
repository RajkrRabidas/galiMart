const Rider = require("../models/rider.model")

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

    const {isAvailble, latitude, longitude} = req.body

    if(typeof isAvailble !== "boolean"){
        return res.status(400).json({
            message: "isAvailble must be boolean"
        })
    }

    if(latitude === undefined || longitude === undefined){
        return res.status(400).json({
            message: "loccation is required"
        })
    }

    const rider = await Rider.findOne({
        userId: user._id
    });

    if(!rider){
        return res.status(404).json({
            message: "Rider profile not found"
        })
    }

    if(isAvailble && !rider.isVerified){
      return res.status(403).json({
        message: "Rider is not verified yet"
      })
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
      rider
    })

}


module.exports = {addRidderProfile, fetchMyProfile, toggleRiderAvailability}
