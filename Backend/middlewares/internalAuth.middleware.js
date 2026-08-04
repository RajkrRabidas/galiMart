const jwt = require("jsonwebtoken");

const verifyInternalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Missing internal auth token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.type !== "internal") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.internalAuth = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = { verifyInternalAuth };
