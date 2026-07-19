const jwt = require("jsonwebtoken");
const { redisClient } = require("../services/redis");

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

const jwtSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET || process.env.REFRESH_SECERET;

const generateToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, jwtSecret, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ id }, refreshSecret, {
    expiresIn: "7d",
  });

  const refreshTokenKey = `refresh_token:${id}`;

  await redisClient.set(refreshTokenKey, refreshToken, { EX: 7 * 24 * 60 * 60 });

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

const VerifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const storedRefreshToken = await redisClient.get(`refresh_token:${decoded.id}`);

    if (storedRefreshToken === refreshToken) {
      return decoded;
    }

    return null;
  } catch (error) {
    return null;
  }
};

const generateNewAccessToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, jwtSecret, { expiresIn: "1m" });

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 1000,
  });

  return { accessToken };
};

const rotateRefreshToken = async (id, res, oldRefreshToken) => {
  const accessToken = jwt.sign({ id }, jwtSecret, { expiresIn: "1m" });
  const refreshToken = jwt.sign({ id }, refreshSecret, { expiresIn: "7d" });

  await redisClient.del(`refresh_token:${id}`);
  await redisClient.set(`refresh_token:${id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

const revokeRefreshToken = async (id) => {
  await redisClient.del(`refresh_token:${id}`);
};

module.exports = {
  generateToken,
  VerifyRefreshToken,
  generateNewAccessToken,
  rotateRefreshToken,
  revokeRefreshToken,
};
