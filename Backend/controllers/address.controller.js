const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const { addressSchema } = require("../config/zod");
const userDetailsModel = require("../models/userDetails.model");

const getOwnerId = (user) => String(user?._id || user?.id || "");
const buildFormattedAddress = ({ buildingName, locality, landmark, city, state, pinCode }) =>
  [buildingName, locality, landmark, city, state, pinCode ? `PIN ${pinCode}` : ""]
    .filter(Boolean)
    .join(", ");

const validationResponse = (error) => ({
  message: error.issues?.[0]?.message || "Please check the address details.",
  errors: (error.issues || []).map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  })),
});

const validateAddress = (body) => addressSchema.safeParse(sanitize(body || {}));
const validId = (id) => mongoose.isValidObjectId(id);
const databaseError = (res, error, action) => {
  console.error(`Address ${action} error:`, error);
  if (error?.code === 11000) {
    return res.status(409).json({ message: "Unable to set this address as default. Please try again." });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ message: "Invalid address ID" });
  }
  return res.status(500).json({ message: "Unable to process address right now. Please try again." });
};

const addAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const validation = validateAddress(req.body);
  if (!validation.success) return res.status(400).json(validationResponse(validation.error));

  try {
    const data = validation.data;
    const hasDefaultAddress = await userDetailsModel.exists({ userId, isDefault: true });
    const addressData = {
      userId,
      ...data,
      phoneNumber: `+91${data.phoneNumber}`,
      mobile: Number(data.phoneNumber),
      formattedAddress: buildFormattedAddress(data),
      isDefault: !hasDefaultAddress,
    };

    let address;
    try {
      address = await userDetailsModel.create(addressData);
    } catch (error) {
      // A concurrent first-address save can race for the unique default slot.
      if (error?.code !== 11000 || !addressData.isDefault) throw error;
      address = await userDetailsModel.create({ ...addressData, isDefault: false });
    }

    return res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    return databaseError(res, error, "create");
  }
};

const listAddresses = async (req, res) => {
  const userId = getOwnerId(req.user);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const addresses = await userDetailsModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json({ addresses });
  } catch (error) {
    return databaseError(res, error, "list");
  }
};

const getAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!validId(id)) return res.status(400).json({ message: "Invalid address ID" });

  try {
    const address = await userDetailsModel.findOne({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Address not found" });
    return res.status(200).json({ address });
  } catch (error) {
    return databaseError(res, error, "fetch");
  }
};

const updateAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!validId(id)) return res.status(400).json({ message: "Invalid address ID" });

  const validation = validateAddress(req.body);
  if (!validation.success) return res.status(400).json(validationResponse(validation.error));

  try {
    const data = validation.data;
    const address = await userDetailsModel.findOneAndUpdate(
      { _id: id, userId },
      {
        ...data,
        phoneNumber: `+91${data.phoneNumber}`,
        mobile: Number(data.phoneNumber),
        formattedAddress: buildFormattedAddress(data),
      },
      { new: true, runValidators: true },
    );
    if (!address) return res.status(404).json({ message: "Address not found" });
    return res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    return databaseError(res, error, "update");
  }
};

const deleteAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!validId(id)) return res.status(400).json({ message: "Invalid address ID" });

  try {
    const address = await userDetailsModel.findOne({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Address not found" });

    const result = await userDetailsModel.deleteOne({ _id: id, userId });
    if (!result.deletedCount) return res.status(404).json({ message: "Address not found" });

    if (address.isDefault) {
      const replacement = await userDetailsModel.findOne({ userId }).sort({ createdAt: -1 });
      if (replacement) {
        await userDetailsModel.findOneAndUpdate(
          { _id: replacement._id, userId },
          { $set: { isDefault: true } },
          { new: true, runValidators: true },
        );
      }
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    return databaseError(res, error, "delete");
  }
};

const setDefaultAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!validId(id)) return res.status(400).json({ message: "Invalid address ID" });

  try {
    const ownedAddress = await userDetailsModel.findOne({ _id: id, userId });
    if (!ownedAddress) return res.status(404).json({ message: "Address not found" });

    await userDetailsModel.updateMany(
      { userId, isDefault: true, _id: { $ne: id } },
      { $set: { isDefault: false } },
    );
    const address = await userDetailsModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true, runValidators: true },
    );
    return res.status(200).json({ message: "Default address updated", address });
  } catch (error) {
    return databaseError(res, error, "set default");
  }
};

const getDefaultAddress = async (req, res) => {
  const userId = getOwnerId(req.user);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const address = await userDetailsModel.findOne({ userId, isDefault: true });
    return res.status(200).json({ address: address || null });
  } catch (error) {
    return databaseError(res, error, "fetch default");
  }
};

module.exports = {
  addAddress,
  listAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
  // Keep the original handler name for existing internal consumers.
  getMyAddress: listAddresses,
};
