const riderModel = require("../models/rider.model");
const shopModel = require("../models/shop.model");
const { Types } = require("mongoose");
const userModel = require("../models/user.model");
const orderModel = require("../models/order");
const complaintModel = require("../models/complaint.model");
const adminActivityModel = require("../models/adminActivity.model");

const logActivity = (req, action, entityType, entityId, reason = null, metadata = null) =>
  adminActivityModel.create({ adminId: req.user._id, action, entityType, entityId: entityId ? String(entityId) : null, reason, metadata });

const findByIdOrBadRequest = (id, label, res) => {
  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `Invalid ${label} id` });
    return false;
  }

  return true;
};

const getPendingShops = async (req, res) => {
  const shops = await shopModel.find({ isVerified: false, status: { $ne: "rejected" } }).lean();

  res.json({
    count: shops.length,
    shops,
  });
};

const getVerifiedShops = async (req, res) => {
  const shops = await shopModel.find({ isVerified: true }).lean();
  res.json({ count: shops.length, shops });
};

const verifyShop = async (req, res) => {
  const { shopId } = req.params;
  const reason = String(req.body?.reason || "").trim();

  if (typeof shopId !== "string") {
    return res.status(400).json({
      message: "Invalid shop id",
    });
  }

  if (!Types.ObjectId.isValid(shopId)) {
    return res.status(400).json({
      message: "Invalid Object id",
    });
  }

  const shop = await shopModel.findOne({ _id: shopId });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const result = await shopModel.updateOne(
    { _id: shopId },
    { $set: { isVerified: true, status: "approved", verificationReason: reason || null, verifiedAt: new Date(), verifiedBy: req.user._id, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Shop not found" });
  }

  await logActivity(req, "approve", "shop", shopId, reason);

  res.json({ message: "Shop verified successfully" });
};

const rejectShop = async (req, res) => {
  const { shopId } = req.params;
  const reason = String(req.body?.reason || "").trim();
  if (!findByIdOrBadRequest(shopId, "shop", res)) return;
  if (!reason) return res.status(400).json({ message: "Rejection reason is required" });
  const result = await shopModel.updateOne({ _id: shopId }, { $set: { isVerified: false, status: "rejected", verificationReason: reason, verifiedAt: null, verifiedBy: null, updatedAt: new Date() } });
  if (!result.matchedCount) return res.status(404).json({ message: "Shop not found" });
  await logActivity(req, "reject", "shop", shopId, reason);
  res.json({ message: "Shop rejected successfully" });
};

const unverifyShop = async (req, res) => {
  const { shopId } = req.params;
  if (!findByIdOrBadRequest(shopId, "shop", res)) return;

  const result = await shopModel.updateOne(
    { _id: shopId },
    { $set: { isVerified: false, status: "pending", updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) return res.status(404).json({ message: "Shop not found" });
  res.json({ message: "Shop unverified successfully" });
};

const getShopDetails = async (req, res) => {
  const { shopId } = req.params;

  if (!findByIdOrBadRequest(shopId, "shop", res)) return;

  const shop = await shopModel.findById(shopId).lean();
  if (!shop) return res.status(404).json({ message: "Shop not found" });

  res.json({ shop });
};

const getPendingRiders = async (req, res) => {
  const riders = await riderModel.find({ isVerified: false, verificationStatus: { $ne: "rejected" } }).lean();

  res.json({
    count: riders.length,
    riders,
  });
};

const getVerifiedRiders = async (req, res) => {
  const riders = await riderModel.find({ isVerified: true, verificationStatus: "approved" }).lean();
  res.json({ count: riders.length, riders });
};

const verifyRider = async (req, res) => {
  const { riderId } = req.params;
  const reason = String(req.body?.reason || "").trim();

  if (typeof riderId !== "string") {
    return res.status(400).json({
      message: "Invalid rider id",
    });
  }

  if (!Types.ObjectId.isValid(riderId)) {
    return res.status(400).json({
      message: "Invalid Object id",
    });
  }

  const rider = await riderModel.findOne({ _id: riderId });
  if (!rider) {
    return res.status(404).json({ message: "Rider not found" });
  }

  const result = await riderModel.updateOne(
    { _id: riderId },
    { $set: { isVerified: true, verificationStatus: "approved", verificationReason: reason || null, verifiedAt: new Date(), verifiedBy: req.user._id, isSuspended: false, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Rider not found" });
  }

  await logActivity(req, "approve", "rider", riderId, reason);

  res.json({ message: "Rider verified successfully" });
};

const rejectRider = async (req, res) => {
  const { riderId } = req.params;
  const reason = String(req.body?.reason || "").trim();
  if (!findByIdOrBadRequest(riderId, "rider", res)) return;
  if (!reason) return res.status(400).json({ message: "Rejection reason is required" });
  const result = await riderModel.updateOne({ _id: riderId }, { $set: { isVerified: false, verificationStatus: "rejected", verificationReason: reason, verifiedAt: null, verifiedBy: null, updatedAt: new Date() } });
  if (!result.matchedCount) return res.status(404).json({ message: "Rider not found" });
  await logActivity(req, "reject", "rider", riderId, reason);
  res.json({ message: "Rider rejected successfully" });
};

const updateEntitySuspension = async (req, res, model, type, id) => {
  if (!findByIdOrBadRequest(id, type, res)) return;
  const suspended = req.body?.suspended === true;
  const reason = String(req.body?.reason || "").trim();
  if (suspended && !reason) return res.status(400).json({ message: "Suspension reason is required" });
  const update = type === "shop"
    ? { status: suspended ? "suspended" : "approved" }
    : { isSuspended: suspended, suspensionReason: suspended ? reason : null };
  const result = await model.updateOne({ _id: id }, { $set: { ...update, updatedAt: new Date() } });
  if (!result.matchedCount) return res.status(404).json({ message: `${type} not found` });
  await logActivity(req, suspended ? "suspend" : "activate", type, id, reason);
  res.json({ message: `${type} ${suspended ? "suspended" : "activated"} successfully` });
};

const suspendShop = (req, res) => updateEntitySuspension(req, res, shopModel, "shop", req.params.shopId);
const suspendRider = (req, res) => updateEntitySuspension(req, res, riderModel, "rider", req.params.riderId);

const getUsers = async (req, res) => {
  const search = String(req.query.search || "").trim();
  const filter = search ? { phone: { $regex: search.replace(/\D/g, ""), $options: "i" } } : {};
  const users = await userModel.find(filter).select("phone role isVerified isBlocked isDeleted createdAt lastLogin").sort({ createdAt: -1 }).limit(100).lean();
  res.json({ count: users.length, users });
};

const updateUserStatus = async (req, res) => {
  if (!findByIdOrBadRequest(req.params.userId, "user", res)) return;
  const blocked = req.body?.blocked === true;
  const reason = String(req.body?.reason || "").trim();
  if (blocked && !reason) return res.status(400).json({ message: "Block reason is required" });
  const result = await userModel.updateOne({ _id: req.params.userId }, { $set: { isBlocked: blocked, suspensionReason: blocked ? reason : null } });
  if (!result.matchedCount) return res.status(404).json({ message: "User not found" });
  await logActivity(req, blocked ? "block" : "unblock", "user", req.params.userId, reason);
  res.json({ message: `User ${blocked ? "blocked" : "unblocked"} successfully` });
};

const getOrders = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  const orders = await orderModel.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ count: orders.length, orders });
};

const getOverview = async (req, res) => {
  const [users, shops, riders, pendingShops, pendingRiders, orders, revenue, complaints] = await Promise.all([
    userModel.countDocuments(), shopModel.countDocuments(), riderModel.countDocuments(),
    shopModel.countDocuments({ isVerified: false, status: { $ne: "rejected" } }), riderModel.countDocuments({ isVerified: false, verificationStatus: { $ne: "rejected" } }),
    orderModel.countDocuments(), orderModel.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, amount: { $sum: { $ifNull: ["$totalAmount", 0] } }, count: { $sum: 1 } } }]),
    complaintModel.countDocuments({ status: { $in: ["open", "in_progress"] } }),
  ]);
  res.json({ users, shops, riders, pendingShops, pendingRiders, orders, openComplaints: complaints, revenue: revenue[0] || { amount: 0, count: 0 } });
};

const getComplaints = async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const complaints = await complaintModel.find(filter).populate("raisedBy", "phone role").sort({ createdAt: -1 }).limit(100).lean();
  res.json({ count: complaints.length, complaints });
};

const updateComplaint = async (req, res) => {
  if (!findByIdOrBadRequest(req.params.complaintId, "complaint", res)) return;
  const { status, adminReply } = req.body || {};
  if (!["open", "in_progress", "resolved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid complaint status" });
  const result = await complaintModel.updateOne({ _id: req.params.complaintId }, { $set: { status, adminReply: adminReply || null, resolvedBy: ["resolved", "rejected"].includes(status) ? req.user._id : null, resolvedAt: ["resolved", "rejected"].includes(status) ? new Date() : null } });
  if (!result.matchedCount) return res.status(404).json({ message: "Complaint not found" });
  await logActivity(req, "update_status", "complaint", req.params.complaintId, adminReply);
  res.json({ message: "Complaint updated successfully" });
};

const getActivityLogs = async (req, res) => {
  const logs = await adminActivityModel.find().populate("adminId", "phone role").sort({ createdAt: -1 }).limit(200).lean();
  res.json({ count: logs.length, logs });
};

const unverifyRider = async (req, res) => {
  const { riderId } = req.params;
  if (!findByIdOrBadRequest(riderId, "rider", res)) return;

  const result = await riderModel.updateOne(
    { _id: riderId },
    { $set: { isVerified: false, verificationStatus: "pending", updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) return res.status(404).json({ message: "Rider not found" });
  res.json({ message: "Rider unverified successfully" });
};

const getRiderDetails = async (req, res) => {
  const { riderId } = req.params;

  if (!findByIdOrBadRequest(riderId, "rider", res)) return;

  const rider = await riderModel.findById(riderId).lean();
  if (!rider) return res.status(404).json({ message: "Rider not found" });

  res.json({ rider });
};

module.exports = {
  getOverview,
  getUsers,
  updateUserStatus,
  getOrders,
  getComplaints,
  updateComplaint,
  getActivityLogs,
  getPendingShops,
  getVerifiedShops,
  getShopDetails,
  verifyShop,
  rejectShop,
  suspendShop,
  unverifyShop,
  getPendingRiders,
  getVerifiedRiders,
  getRiderDetails,
  verifyRider,
  rejectRider,
  suspendRider,
  unverifyRider,
};
