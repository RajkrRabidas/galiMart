const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const sanitize = require("mongo-sanitize");
const bcrypt = require("bcryptjs");
const { registerSchema, loginSchema, completeProfileSchema } = require("../config/zod");
const { redisClient } = require("../services/redis");
const twilio = require("twilio");
const ROLES = require("../constants/roles");
const {
  generateToken,
  VerifyRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} = require("../config/generateToken");
const userDetailsModel = require("../models/userDetails.model");

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.accountSid;
const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.authToken;
const twilioFromNumber =
  process.env.TWILIO_FROM_NUMBER || process.env.fromNumber || "+15717478662";

const twilioClient = accountSid && authToken ? new twilio(accountSid, authToken) : null;

const OTP_TTL_SECONDS = 300;
const OTP_ATTEMPT_LIMIT = 5;
const OTP_BLOCK_DURATION_SECONDS = 600;
const OTP_RATE_LIMIT_SECONDS = 60;
const OTP_RESEND_LIMIT = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const createValidationErrorResponse = (validation) => {
  const zodError = validation.error;
  let firstErrorMessage = "Validation Failed";
  let allError = [];

  if (zodError?.issues && Array.isArray(zodError.issues)) {
    allError = zodError.issues.map((issue) => ({
      field: issue.path ? issue.path.join(".") : "unknown",
      message: issue.message || "validation error",
      code: issue.code || "validation_error",
    }));
    firstErrorMessage = allError[0]?.message || "Validation Failed";
  }

  return {
    status: 400,
    body: {
      message: firstErrorMessage,
      errors: allError,
    },
  };
};

const logAuthEvent = async (event, payload) => {
  try {
    if (typeof redisClient?.lPush !== "function") {
      return;
    }

    await redisClient.lPush("auth-events", JSON.stringify({ event, payload, timestamp: Date.now() }));
    await redisClient.lTrim("auth-events", 0, 99);
  } catch (error) {
    console.error("Auth event logging error:", error);
  }
};

const sendOtpSms = async (phone, otp) => {
  if (!twilioClient) {
    console.log(`[OTP] SMS skipped. Phone: ${phone}, OTP: ${otp}`);
    return true;
  }

  await twilioClient.messages.create({
    body: `Your OTP is: ${otp}`,
    to: phone,
    from: twilioFromNumber,
  });

  return true;
};

const issueOtp = async ({ phone, role, purpose }) => {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const activeOtpKey = purpose === "login" ? `verify-login-token:${phone}` : `verify-register-token:${phone}`;
  const attemptKey = `otp-attempt:${phone}:${purpose}`;
  const resendKey = `otp-resend:${phone}:${purpose}`;
  const cooldownKey = `otp-cooldown:${phone}:${purpose}`;

  const currentResends = parseInt((await redisClient.get(resendKey)) || "0", 10);
  if (currentResends >= OTP_RESEND_LIMIT) {
    return { status: 429, body: { message: "Too many OTP resends. Please wait before trying again." } };
  }

  if (await redisClient.get(cooldownKey)) {
    return { status: 429, body: { message: "Please wait before requesting another OTP." } };
  }

  const dataToStore = JSON.stringify({ phone, role, otp: hashedOtp, purpose, createdAt: Date.now() });
  await redisClient.set(activeOtpKey, dataToStore, { EX: OTP_TTL_SECONDS });
  await redisClient.del(attemptKey);
  await redisClient.set(resendKey, currentResends + 1, { EX: OTP_RESEND_COOLDOWN_SECONDS });
  await redisClient.set(cooldownKey, "true", { EX: OTP_RESEND_COOLDOWN_SECONDS });
  await sendOtpSms(phone, otp);

  await logAuthEvent("otp_sent", { phone, purpose });

  return { status: 202, body: { message: "OTP sent successfully." } };
};

const verifyOtpAgainstStoredValue = async ({ phone, otp, purpose }) => {
  const activeOtpKey = purpose === "login" ? `verify-login-token:${phone}` : `verify-register-token:${phone}`;
  const attemptKey = `otp-attempt:${phone}:${purpose}`;

  const storedData = await redisClient.get(activeOtpKey);
  if (!storedData) {
    return {
      status: 400,
      body: {
        code: "OTP_EXPIRED",
        message: "OTP expired. Please request a new one.",
      },
    };
  }

  const parsed = JSON.parse(storedData);
  const currentAttempts = parseInt((await redisClient.get(attemptKey)) || "0", 10);
  if (currentAttempts >= OTP_ATTEMPT_LIMIT) {
    return {
      status: 429,
      body: {
        code: "OTP_BLOCKED",
        message: "Too many OTP attempts. Please try again after 10 minutes.",
      },
    };
  }

  const isValidOtp = await bcrypt.compare(otp, parsed.otp);
  if (!isValidOtp) {
    const attempts = await redisClient.incr(attemptKey);
    if (attempts === 1) {
      await redisClient.expire(attemptKey, OTP_BLOCK_DURATION_SECONDS);
    }

    if (attempts >= OTP_ATTEMPT_LIMIT) {
      return {
        status: 429,
        body: {
          code: "OTP_BLOCKED",
          message: "Too many OTP attempts. Please try again after 10 minutes.",
        },
      };
    }

    return {
      status: 400,
      body: {
        code: "OTP_INVALID",
        message: "Invalid OTP. Please try again.",
        attemptsRemaining: OTP_ATTEMPT_LIMIT - attempts,
      },
    };
  }

  await redisClient.del(activeOtpKey);
  await redisClient.del(attemptKey);

  return { status: 200, body: parsed };
};

const registerUser = async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const errorResponse = createValidationErrorResponse(validation);
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  try {
    const { phone, role } = validation.data;

    const phoneRateLimitKey = `register-rate-limit:phone:${phone}`;
    const ipRateLimitKey = `register-rate-limit:ip:${req.ip}`;

    if (
      (await redisClient.get(phoneRateLimitKey)) ||
      (await redisClient.get(ipRateLimitKey))
    ) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login instead." });
    }

    const otpResult = await issueOtp({ phone, role, purpose: "register" });
    if (otpResult.status !== 202) {
      return res.status(otpResult.status).json(otpResult.body);
    }

    await redisClient.set(phoneRateLimitKey, "true", { EX: OTP_RATE_LIMIT_SECONDS });
    await redisClient.set(ipRateLimitKey, "true", { EX: OTP_RATE_LIMIT_SECONDS });

    await redisClient.set(verifyKey, dataToStore, { EX: OTP_TTL_SECONDS });
    await redisClient.del(attemptKey);

    console.log("Generated OTP:", otp);
    //await twilioClient.messages.create({
    //  body: `Your Otp is: ${otp}`,
    //  to: phone, // Text your number
    //  from: "+15717478662", // From a valid Twilio number
    //});

    await redisClient.set(phoneRateLimitKey, "true", {
      EX: OTP_RATE_LIMIT_SECONDS,
    });
    await redisClient.set(ipRateLimitKey, "true", {
      EX: OTP_RATE_LIMIT_SECONDS,
    });

    return res.status(202).json({ message: "OTP sent successfully.", otp });
    return res.status(otpResult.status).json(otpResult.body,{message:"OTP sent successfully. Please verify to complete registration.", otpResult});
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { phone, otp } = sanitizedBody;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required." });
    }

    const verification = await verifyOtpAgainstStoredValue({ phone, otp, purpose: "register" });
    if (verification.status !== 200) {
      return res.status(verification.status).json(verification.body);
    }

    const parsed = verification.body;
    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      await logAuthEvent("registration_conflict", { phone });
      return res.status(400).json({ message: "User already exists, please login instead." });
    }

    const newUser = await userModel.create({
      phone: parsed.phone,
      role: parsed.role || ROLES.CUSTOMER,
      isVerified: true,
      isBlocked: false,
      isDeleted: false,
      lastLogin: Date.now(),
    });

    const tokens = await generateToken(newUser.id, res);
    await logAuthEvent("register_verified", { userId: newUser.id, phone });

    res.status(200).json({ message: "Registration successful.", user: newUser, tokens });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const errorResponse = createValidationErrorResponse(validation);
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  try {
    const { phone } = validation.data;
    const existingUser = await userModel.findOne({ phone });

    if (!existingUser) {
      return res.status(404).json({ message: "No account found. Please register first." });
    }

    if (existingUser.isBlocked || existingUser.isDeleted) {
      return res.status(403).json({ message: "This account is unavailable." });
    }

    const otpResult = await issueOtp({ phone, role: existingUser.role, purpose: "login" });
    if (otpResult.status !== 202) {
      return res.status(otpResult.status).json(otpResult.body);
    }

    return res.status(otpResult.status).json(otpResult.body);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { phone, otp } = sanitizedBody;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required." });
    }

    const verification = await verifyOtpAgainstStoredValue({ phone, otp, purpose: "login" });
    if (verification.status !== 200) {
      return res.status(verification.status).json(verification.body);
    }

    const parsed = verification.body;
    const user = await userModel.findOne({ phone: parsed.phone });

    if (!user || user.isBlocked || user.isDeleted) {
      return res.status(403).json({ message: "This account is unavailable." });
    }

    user.lastLogin = Date.now();
    await user.save();

    const tokens = await generateToken(user.id, res);
    await logAuthEvent("login_verified", { userId: user.id, phone });

    res.status(200).json({ message: "Login successful.", user, tokens });
  } catch (error) {
    console.error("Verify login OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { phone, purpose } = sanitizedBody;

    if (!phone || !["register", "login"].includes(purpose)) {
      return res.status(400).json({ message: "Phone and purpose are required." });
    }

    if (purpose === "register") {
      const existingUser = await userModel.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists, please login instead." });
      }
    } else {
      const existingUser = await userModel.findOne({ phone });
      if (!existingUser || existingUser.isBlocked || existingUser.isDeleted) {
        return res.status(404).json({ message: "No active account found." });
      }
    }

    const otpResult = await issueOtp({ phone, role: purpose === "register" ? ROLES.CUSTOMER : undefined, purpose });
    if (otpResult.status !== 202) {
      return res.status(otpResult.status).json(otpResult.body);
    }

    return res.status(otpResult.status).json(otpResult.body);
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const myProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("-password");
    const userDetails = await userDetailsModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile retrieved successfully.", user, userDetails });
  } catch (error) {
    console.error("My profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenValue = req.cookies?.refresh_token || req.body?.refreshToken;

    if (!refreshTokenValue) {
      return res.status(403).json({ message: "Please login - no token provided" });
    }

    const decoded = await VerifyRefreshToken(refreshTokenValue);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const tokens = await rotateRefreshToken(decoded.id, res, refreshTokenValue);
    await logAuthEvent("refresh_token_rotated", { userId: decoded.id });

    res.status(200).json({ message: "Access token refreshed", tokens });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const refreshTokenValue = req.cookies?.refresh_token || req.body?.refreshToken;

    if (userId) {
      await revokeRefreshToken(userId);
    } else if (refreshTokenValue) {
      try {
        const decoded = jwt.decode(refreshTokenValue);
        if (decoded?.id) {
          await revokeRefreshToken(decoded.id);
        }
      } catch (error) {
        console.error("Logout decode error:", error);
      }
    }

    res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "none" });
    await logAuthEvent("logout", { userId });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const sanitizedBody = sanitize(req.body);
    const validation = completeProfileSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      const errorResponse = createValidationErrorResponse(validation);
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const { fullName, email, address, pinCode, location } = validation.data;
    const profilePayload = {
      userId,
      fullName,
      email: email || undefined,
      address,
      pinCode,
      location: location || { type: "Point", coordinates: [0, 0] },
    };

    const updatedUser = await userDetailsModel.findOneAndUpdate(
      { userId },
      { $set: profilePayload },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    return res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Complete profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  verifyLoginOtp,
  resendOtp,
  completeProfile,
  myProfile,
  refreshToken,
  logoutUser,
};
