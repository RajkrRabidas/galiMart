const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const { registerSchema, loginSchema } = require("../config/zod");
const { connectRedis, redisClient } = require("../services/redis");
const sendMail = require("../config/sendMail");
const { getVerifyEmailHtml, getOtpHtml } = require("../config/html");
const { generateToken, VerifyRefreshToken, generateNewAccessToken, revokeRefreshToken } = require("../config/generateToken");
const { generateCSRFToken, revokeCSRFToken } = require("../config/CSRFMiddleware");

const registerUser = async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
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

    return res.status(400).json({
      message: firstErrorMessage,
      errors: allError,
    });
  }

  try {
    const { fullName, email, password, phone, role } = validation.data;

    const ratelimitKey = `register-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(ratelimitKey)) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login instead." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyKey = `verify-token:${verifyToken}`;
    const dataToStore = JSON.stringify({ fullName, email, password: hashPassword, phone, role });

    await redisClient.set(verifyKey, dataToStore, { EX: 300 }); // 5 min

    const subject = "Verify your email";
    const html = getVerifyEmailHtml({ email, token: verifyToken });
    await sendMail({ email, subject, html });

    await redisClient.set(ratelimitKey, "true", { EX: 60 }); // 1 min rate limit

    res
      .status(200)
      .json({
        message:
          "Registration successful. Please check your email to verify your account.",
      });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token is required" })
  }

  const verifyKey = `verify-token:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({ message: "Invalid or expired token" })
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await userModel.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await userModel.create({
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    role: userData.role,
  });

  res.status(200).json({ message: "Email verified successfully", user: newUser });
}

const loginUser = async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
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

    return res.status(400).json({
      message: firstErrorMessage,
      errors: allError,
    });
  }

  try {
    const { email, password } = validation.data;

    const ratelimitKey = `login-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(ratelimitKey)) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    let user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "user already exist" })
    }

    const comparePassword = await bcrypt.compare(password, user.password)

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const otp = Math.floor(10000 + Math.random() * 900000).toString()

    const optKey = `otp:${email}`

    await redisClient.set(optKey, JSON.stringify(otp), {
      EX: 300
    })

    const subject = "Otp for Validation"

    const html = getOtpHtml({ email, otp })

    await sendMail({ email, subject, html })

    await redisClient.set(ratelimitKey, "ture", { EX: 60 }); // 1 min rate limit

    res.status(200).json({ message: "Otp sent to your email, it is valid for 5 min" })

  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Please Provide all details" })
  }

  const otpKey = `otp:${email}`

  const storeOtpString = await redisClient.get(otpKey)

  if (!storeOtpString) {
    return res.status(400).json({ message: "otp expired" })
  }

  const storeOtp = JSON.parse(storeOtpString)

  if (storeOtp !== otp) {
    return res.status(400).json({ message: "invalid Otp" })
  }

  await redisClient.del(otpKey)

  let user = await userModel.findOne({ email })

  const tokens = await generateToken(user.id, res)

  res.status(200).json({ message: `welcome ${user.name}`, user, accessToken: tokens.accessToken })

}

const myProfile = async (req, res) => {

  const user = req.user
  res.json(user)
}

const refreshToken = async (req, res) => {
  try {
     const refreshToken = req.cookies?.refresh_token

  if (!refreshToken) {
      return res.status(403).json({ message: "Please login - no token provided" })
  }

  const decode = await VerifyRefreshToken(refreshToken)

  if(!decode) {
      return res.status(403).json({ message: "Invalid refresh token" })
  }

  await generateNewAccessToken(decode.id, res)

  res.status(200).json({ message: "Access token refreshed", user: req.user }) 
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await revokeRefreshToken(userId);
    await revokeCSRFToken(userId);

    res.clearCookie("access_token" )
    res.clearCookie("refresh_token")
    res.clearCookie("CSRFToken")

    await redisClient.del(`user${userId}`)

    res.status(200).json({ message: "Logged out successfully" }); 
  }catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const refreshCSRF = async (req, res) => {
  const userId = req.user._id
  const newCSRFToken = await generateCSRFToken(userId, res)

  res.json({
    message: "CSRF token refresh",
    csrfToken: newCSRFToken,
  })
}


module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  verifyOtp,
  myProfile,
  refreshToken,
  logoutUser,
  refreshCSRF
};
