const verifyInternalAuth = (req, res, next) => {
  if (typeof next === "function") {
    return next();
  }

  return res.status(200).json({ message: "Internal auth middleware is not required for this monolith" });
};

module.exports = { verifyInternalAuth };
