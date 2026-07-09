const userModel = require("../models/user.model");
const crypto = require("crypto");
const sanitize = require("mongo-sanitize");
const { registerSchema } = require("../config/zod");
const { redisClient } = require("../services/redis");
const twilio = require("twilio");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;

const twilioClient = new twilio(accountSid, authToken);

const OTP_TTL_SECONDS = 300;
const OTP_ATTEMPT_LIMIT = 5;
const OTP_BLOCK_DURATION_SECONDS = 600; 
const OTP_RATE_LIMIT_SECONDS = 60; // 1 minute for rate limiting

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

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
    const { phone, role } = validation.data;

    const phoneRateLimitKey = `register-rate-limit:phone:${phone}`;
    const ipRateLimitKey = `register-rate-limit:ip:${req.ip}`;

    if (
      (await redisClient.get(phoneRateLimitKey)) ||
      (await redisClient.get(ipRateLimitKey))
    ) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    const existingUser = await userModel.findOne({ phone });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, please login instead." });
    }

    const activeOtpKey = `verify-token:${phone}`;
    const existingOtpData = await redisClient.get(activeOtpKey);
    if (existingOtpData) {
      return res.status(200).json({ message: "OTP already sent." });
    }

    const otp = generateOtp();
    const verifyKey = activeOtpKey;
    const attemptKey = `otp-attempt:${phone}`;
    const dataToStore = JSON.stringify({ phone, role, otp });

    await redisClient.set(verifyKey, dataToStore, { EX: OTP_TTL_SECONDS });
    await redisClient.del(attemptKey);

    await twilioClient.messages
      .create({
        body: `Your Otp is: ${otp}`,
        to: phone, // Text your number
        from: "+15717478662", // From a valid Twilio number
      })

    await redisClient.set(phoneRateLimitKey, "true", {
      EX: OTP_RATE_LIMIT_SECONDS,
    });
    await redisClient.set(ipRateLimitKey, "true", {
      EX: OTP_RATE_LIMIT_SECONDS,
    });

    return res.status(202).json({ message: "OTP sent successfully.", otp });
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

    const activeOtpKey = `verify-token:${phone}`;
    const attemptKey = `otp-attempt:${phone}`;

    const storedData = await redisClient.get(activeOtpKey);
    if (!storedData) {
      return res
        .status(400)
        .json({
          message:
            "No active OTP or OTP has expired. Please request a new one.",
        });
    }

    const parsed = JSON.parse(storedData);
    const storedOtp = parsed?.otp;

    const currentAttempts = parseInt(
      (await redisClient.get(attemptKey)) || "0",
      10,
    );
    if (currentAttempts >= OTP_ATTEMPT_LIMIT) {
      return res
        .status(429)
        .json({
          message: "Too many OTP attempts. Try again after 10 minutes.",
        });
    }

    if (otp !== storedOtp) {
      const attempts = await redisClient.incr(attemptKey);
      if (attempts === 1) {
        await redisClient.expire(attemptKey, OTP_BLOCK_DURATION_SECONDS);
      }

      if (attempts >= OTP_ATTEMPT_LIMIT) {
        return res
          .status(429)
          .json({
            message: "Too many OTP attempts. Try again after 10 minutes.",
          });
      }

      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
        attemptsRemaining: OTP_ATTEMPT_LIMIT - attempts,
      });
    }

    await redisClient.del(activeOtpKey);
    await redisClient.del(attemptKey);

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
};
