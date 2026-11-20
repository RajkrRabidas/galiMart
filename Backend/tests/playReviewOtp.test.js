const assert = require("assert");

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PLAY_REVIEW_MODE: process.env.PLAY_REVIEW_MODE,
  PLAY_REVIEW_PHONE: process.env.PLAY_REVIEW_PHONE,
  PLAY_REVIEW_OTP: process.env.PLAY_REVIEW_OTP,
  APITXT_AUTH_KEY: process.env.APITXT_AUTH_KEY,
};

const redisPath = require.resolve("../services/redis");
const tokenPath = require.resolve("../config/generateToken");
const userModelPath = require.resolve("../models/user.model");
const controllerPath = require.resolve("../controllers/user.controller");
const originalModules = {
  redis: require.cache[redisPath],
  token: require.cache[tokenPath],
  userModel: require.cache[userModelPath],
  controller: require.cache[controllerPath],
};

const makeRes = () => {
  const res = { statusCode: 200, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return body;
  };
  res.cookie = () => {};
  return res;
};

(async () => {
  let originalRandomInt;
  let originalAxiosPost;
  try {
    process.env.NODE_ENV = "production";
    process.env.PLAY_REVIEW_MODE = "true";
    process.env.PLAY_REVIEW_PHONE = "919876543210";
    process.env.PLAY_REVIEW_OTP = "654321";
    process.env.APITXT_AUTH_KEY = "test-auth-key";

    const values = new Map();
    const redisClient = {
      get: async (key) => values.get(key) || null,
      set: async (key, value) => {
        values.set(key, String(value));
        return "OK";
      },
      del: async (...keys) => keys.forEach((key) => values.delete(key)),
      incr: async (key) => {
        const value = Number(values.get(key) || 0) + 1;
        values.set(key, String(value));
        return value;
      },
      expire: async () => 1,
      lPush: async () => 1,
      lTrim: async () => "OK",
    };

    require.cache[redisPath] = {
      id: redisPath,
      filename: redisPath,
      loaded: true,
      exports: { redisClient },
    };
    require.cache[tokenPath] = {
      id: tokenPath,
      filename: tokenPath,
      loaded: true,
      exports: {
        generateToken: async () => ({ accessToken: "test-access-token" }),
        VerifyRefreshToken: async () => null,
        rotateRefreshToken: async () => ({}),
        revokeRefreshToken: async () => {},
        clearAuthCookies: () => {},
      },
    };

    delete require.cache[userModelPath];
    const userModel = require("../models/user.model");
    const reviewAccount = {
      id: "review-customer",
      phone: "9876543210",
      role: "user",
      isBlocked: false,
      isDeleted: false,
      save: async () => {},
    };
    const otherAccount = {
      id: "other-customer",
      phone: "9876543211",
      role: "user",
      isBlocked: false,
      isDeleted: false,
      save: async () => {},
    };
    const failedSmsAccount = {
      id: "sms-failure-customer",
      phone: "9876543212",
      role: "user",
      isBlocked: false,
      isDeleted: false,
      save: async () => {},
    };
    userModel.findOne = async ({ phone }) => {
      if (phone === reviewAccount.phone) return reviewAccount;
      if (phone === otherAccount.phone) return otherAccount;
      if (phone === failedSmsAccount.phone) return failedSmsAccount;
      return null;
    };

    const axios = require("axios");
    originalAxiosPost = axios.post;
    let smsCalls = 0;
    let rejectSmsWithPaymentRequired = false;
    axios.post = async () => {
      smsCalls += 1;
      if (rejectSmsWithPaymentRequired) {
        const error = new Error("provider error");
        error.response = { status: 402 };
        error.config = { data: "sensitive-request-body" };
        throw error;
      }
      return { status: 200, data: { status: "success" } };
    };

    const crypto = require("crypto");
    originalRandomInt = crypto.randomInt;
    crypto.randomInt = () => 123456;

    delete require.cache[controllerPath];
    const { loginUser, verifyLoginOtp } = require("../controllers/user.controller");

    const reviewLoginRes = makeRes();
    await loginUser({ body: { phone: reviewAccount.phone } }, reviewLoginRes);
    assert.strictEqual(reviewLoginRes.statusCode, 202, "review customer should be able to request a code");
    assert.strictEqual(reviewLoginRes.body.message, "Review verification code is ready.");
    assert.strictEqual(smsCalls, 0, "review login should not send SMS");

    const reviewVerifyRes = makeRes();
    await verifyLoginOtp({
      body: { phone: reviewAccount.phone, otp: process.env.PLAY_REVIEW_OTP },
    }, reviewVerifyRes);
    assert.strictEqual(reviewVerifyRes.statusCode, 200, "configured review code should log in the review customer");

    const otherLoginRes = makeRes();
    await loginUser({ body: { phone: otherAccount.phone } }, otherLoginRes);
    assert.strictEqual(otherLoginRes.statusCode, 202, "normal customer should use standard login flow");
    assert.strictEqual(smsCalls, 1, "normal customer should still receive an SMS");

    const otherReviewCodeRes = makeRes();
    await verifyLoginOtp({
      body: { phone: otherAccount.phone, otp: process.env.PLAY_REVIEW_OTP },
    }, otherReviewCodeRes);
    assert.strictEqual(otherReviewCodeRes.statusCode, 400, "review code must not authenticate another customer");

    const otherOtpRes = makeRes();
    await verifyLoginOtp({ body: { phone: otherAccount.phone, otp: "123456" } }, otherOtpRes);
    assert.strictEqual(otherOtpRes.statusCode, 200, "normal customer should authenticate with their generated OTP");

    reviewAccount.role = "seller";
    await redisClient.del(
      "otp-resend:9876543210:login",
      "otp-cooldown:9876543210:login",
    );
    const sellerLoginRes = makeRes();
    await loginUser({ body: { phone: reviewAccount.phone } }, sellerLoginRes);
    assert.strictEqual(sellerLoginRes.statusCode, 202, "seller account should use the standard login flow");
    assert.strictEqual(smsCalls, 2, "review code must not bypass OTP for non-customer roles");

    const sellerReviewCodeRes = makeRes();
    await verifyLoginOtp({
      body: { phone: reviewAccount.phone, otp: process.env.PLAY_REVIEW_OTP },
    }, sellerReviewCodeRes);
    assert.strictEqual(sellerReviewCodeRes.statusCode, 400, "review code must not authenticate non-customer roles");

    rejectSmsWithPaymentRequired = true;
    const originalConsoleError = console.error;
    const loggedErrors = [];
    console.error = (...args) => loggedErrors.push(args);
    try {
      const failedSmsRes = makeRes();
      await loginUser({ body: { phone: failedSmsAccount.phone } }, failedSmsRes);
      assert.strictEqual(failedSmsRes.statusCode, 503, "provider billing errors should return a service-unavailable response");
      assert.strictEqual(failedSmsRes.body.code, "SMS_PROVIDER_PAYMENT_REQUIRED");
      assert.match(failedSmsRes.body.message, /provider account balance or billing/i);
      assert.strictEqual(
        loggedErrors.flat().some((value) => String(value).includes("sensitive-request-body")),
        false,
        "provider request data must not be written to logs",
      );
      assert.strictEqual(
        values.has("verify-login-token:9876543212"),
        false,
        "an undelivered OTP must not remain valid in Redis",
      );
      assert.strictEqual(
        values.has("otp-cooldown:9876543212:login"),
        true,
        "failed sends should retain cooldown protection",
      );

      const cooldownRes = makeRes();
      await loginUser({ body: { phone: failedSmsAccount.phone } }, cooldownRes);
      assert.strictEqual(cooldownRes.statusCode, 429, "failed sends should remain rate limited");
    } finally {
      console.error = originalConsoleError;
    }

    console.log("play review OTP tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (originalRandomInt) {
      require("crypto").randomInt = originalRandomInt;
    }
    if (originalAxiosPost) {
      require("axios").post = originalAxiosPost;
    }
    for (const [name, path] of Object.entries({
      redis: redisPath,
      token: tokenPath,
      userModel: userModelPath,
      controller: controllerPath,
    })) {
      if (originalModules[name]) {
        require.cache[path] = originalModules[name];
      } else {
        delete require.cache[path];
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
})();
