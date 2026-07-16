const ownershipMiddleware = (options = {}) => {
  const {
    resourceName = "resource",
    getOwnerId = (req) => req.user?.id,
    getResourceOwnerId = (req) => req.resource?.ownerId,
    resourceLookup = null,
    allowAdmin = true,
  } = options;

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (allowAdmin && req.user.role === "admin") {
        return next();
      }

      let resource = req.resource;

      if (!resource && typeof resourceLookup === "function") {
        resource = await resourceLookup(req);
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} not found`,
        });
      }

      const ownerId = getResourceOwnerId(req, resource);
      const currentUserId = getOwnerId(req, resource);

      if (!ownerId || !currentUserId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const ownerMatches = ownerId?.toString() === currentUserId?.toString();

      if (!ownerMatches) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

module.exports = ownershipMiddleware;
