const jwt = require("jsonwebtoken");
const { redisClient } = require("../services/redis");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

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
    console.error("auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;