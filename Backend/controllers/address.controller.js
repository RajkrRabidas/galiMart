const sanitize = require("mongo-sanitize");
const { completeProfileSchema } = require("../config/zod");
const userDetailsModel = require("../models/userDetails.model");
const { getJson, setJson, clearPattern } = require("../services/redis");

const getUserAddressCacheKey = (userId) => `user-addresses:${String(userId)}`;

const addAddress = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sanitizedBody = sanitize(req.body);
    const validation = completeProfileSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      const errorResponse = createValidationErrorResponse(validation);
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const { fullName, email, formattedAddress, latitude, longitude } = validation.data;

    if (!fullName || !formattedAddress || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "please give all fields" });
    }

    // Create a new address document so a user can have multiple addresses
    const newAddress = await userDetailsModel.create({
      userId: user._id.toString(),
      fullName,
      email: email || undefined,
      mobile: Number(user.phone || user.mobile || 0),
      formattedAddress,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    await clearPattern(getUserAddressCacheKey(user._id.toString()));

    res.status(201).json({ message: "Address added successfully", address: newAddress });

  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteAddress = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {id} = req.params

    if(!id) {
        return res.status(400).json({message:"id is required"})
    }

    const address = await userDetailsModel.findOne({
        _id : id,
        userId: user._id.toString()
    });

    if(!address){
        return res.status(404).json({message:"address not found"})
    }

    const result = await userDetailsModel.deleteOne({ _id: id, userId: user._id.toString() });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "address not found or not owned by user" });
    }

    await clearPattern(getUserAddressCacheKey(user._id.toString()));

    res.json({ message: "Address deleted successfully" });
  }catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getMyAddress = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cacheKey = getUserAddressCacheKey(user._id.toString());
    const cachedAddresses = await getJson(cacheKey);

    if (cachedAddresses) {
      return res.json({ addresses: cachedAddresses });
    }

    const addresses = await userDetailsModel.find({ userId: user._id.toString() }).sort({ createdAt: -1 });
    await setJson(cacheKey, addresses, 600);

    res.json({ addresses });

  }catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addAddress,
  deleteAddress,
  getMyAddress
};