const jwt = require("jsonwebtoken");
const { redisClient } = require("../services/redis");
const userModel = require("../models/user.model");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.access_token || (authHeader ? authHeader.split(" ")[1] || authHeader : null);

    if (!token) {
      return res.status(401).json({ message: "Please login - no token provided" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    const cacheUser = await redisClient.get(`user${decodedData.id}`);

    if (cacheUser) {
      req.user = JSON.parse(cacheUser);
      return next();
    }

    const user = await userModel.findById(decodedData.id).select("-password");

    if (!user || user.isBlocked || user.isDeleted) {
      return res.status(404).json({ message: "No user with this ID" });
    }

    await redisClient.setEx(`user${user.id}`, 3600, JSON.stringify(user));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    console.error("auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isSeller = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please login first" });
  }

  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access denied. Only sellers can perform this action." });
  }

  next();
};

const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Please login first" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
  }

  next();
};

module.exports = { isAuth, isSeller, isAdmin };