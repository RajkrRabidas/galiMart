const express = require("express");
const {
  registerUser,
  verifyOtp,
  loginUser,
  verifyLoginOtp,
  resendOtp,
  completeProfile,
  myProfile,
  refreshToken,
  logoutUser,
} = require("../controllers/user.controller");
const {isAuth} = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-register-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/resend-otp", resendOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", isAuth, logoutUser);
router.get("/me", isAuth, myProfile);
router.patch("/complete-profile", isAuth, completeProfile);

router.get(
  "/admin-only",
  isAuth,
  allowRoles(ROLES.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  },
);

module.exports = router;