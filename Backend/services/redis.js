const { createClient } = require("redis");

const memoryStore = new Map();

const createFallbackRedisClient = () => ({
  isOpen: true,
  async connect() {
    this.isOpen = true;
    return this;
  },
  async get(key) {
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  },
  async set(key, value, options = {}) {
    memoryStore.set(key, String(value));
    return "OK";
  },
  async setEx(key, seconds, value) {
    memoryStore.set(key, String(value));
    return "OK";
  },
  async del(keys) {
    const list = Array.isArray(keys) ? keys : [keys];
    let deleted = 0;

    for (const key of list) {
      if (memoryStore.delete(key)) deleted += 1;
    }

    return deleted;
  },
  async keys(pattern = "*") {
    const regex = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
    const keys = [];

    for (const key of memoryStore.keys()) {
      if (regex.test(key)) keys.push(key);
    }

    return keys;
  },
  async lPush(key, value) {
    const existing = memoryStore.get(key) || "[]";
    const list = JSON.parse(existing);
    list.push(value);
    memoryStore.set(key, JSON.stringify(list));
    return list.length;
  },
  async lTrim(key, start, stop) {
    const existing = memoryStore.get(key) || "[]";
    try {
      const list = JSON.parse(existing);
      memoryStore.set(key, JSON.stringify(list.slice(start, stop + 1)));
      return "OK";
    } catch {
      memoryStore.set(key, "[]");
      return "OK";
    }
  },
  async incr(key) {
    const current = Number(memoryStore.get(key) || 0);
    const next = current + 1;
    memoryStore.set(key, String(next));
    return next;
  },
  async expire() {
    return true;
  },
});

const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : createFallbackRedisClient();

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log("Redis not configured; using in-memory cache fallback");
    return false;
  }

  try {
    await redisClient.connect();
    console.log("Connected to Redis");
    return true;
  } catch (err) {
    console.error("Failed to connect to Redis:", err.message);
    return false;
  }
};

const getJson = async (key) => {
  if (!redisClient || typeof redisClient.get !== "function") {
    return null;
  }

  const value = await redisClient.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("JSON parse failed for Redis key:", key, error.message);
    return null;
  }
};

const setJson = async (key, value, ttlSeconds = 3600) => {
  if (!redisClient || typeof redisClient.set !== "function") {
    return null;
  }

  await redisClient.set(key, JSON.stringify(value), { EX: Number(ttlSeconds) });
  return value;
};

const getUserLocationCacheKey = (userId) => `user-location:${String(userId)}`;

const getUserLocationCache = async (userId, ttlSeconds = 300) => {
  const key = getUserLocationCacheKey(userId);
  const cached = await getJson(key);

  if (!cached) return null;

  const expiresAt = Number(cached.expiresAt || 0);
  if (expiresAt && Date.now() > expiresAt) {
    await clearPattern(key);
    return null;
  }

  return cached.data || null;
};

const setUserLocationCache = async (userId, data, ttlSeconds = 300) => {
  const key = getUserLocationCacheKey(userId);
  const payload = {
    expiresAt: Date.now() + Number(ttlSeconds) * 1000,
    data,
  };

  return await setJson(key, payload, ttlSeconds);
};

const clearPattern = async (pattern) => {
  if (!redisClient || typeof redisClient.keys !== "function") {
    return 0;
  }

  const keys = await redisClient.keys(pattern);
  if (!keys.length) return 0;

  return await redisClient.del(keys);
};

module.exports = {
  connectRedis,
  redisClient,
  getJson,
  setJson,
  clearPattern,
  getUserLocationCacheKey,
  getUserLocationCache,
  setUserLocationCache,
};