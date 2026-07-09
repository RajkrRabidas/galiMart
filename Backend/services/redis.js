const { createClient } = require("redis");

if (!process.env.REDIS_URL) {
  throw new Error("missing REDIS_URL");
}

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis:", err.message);
  }
};

module.exports = { connectRedis, redisClient };