const assert = require("assert");
const { getJson, setJson, clearPattern } = require("../services/redis");

(async () => {
  try {
    assert.strictEqual(typeof getJson, "function", "getJson should exist");
    assert.strictEqual(typeof setJson, "function", "setJson should exist");
    assert.strictEqual(typeof clearPattern, "function", "clearPattern should exist");

    await setJson("test:location:cache", { latitude: 28.6, longitude: 77.2 }, 30);
    const value = await getJson("test:location:cache");
    assert.deepStrictEqual(value, { latitude: 28.6, longitude: 77.2 }, "JSON should round-trip through Redis");

    await clearPattern("test:location:*");
    const cleared = await getJson("test:location:cache");
    assert.strictEqual(cleared, null, "Matching cache entries should be cleared");

    const originalRedisUrl = process.env.REDIS_URL;
    try {
      process.env.REDIS_URL = "redis://127.0.0.1:1";
      delete require.cache[require.resolve("../services/redis")];

      const { connectRedis: connectBrokenRedis, redisClient: brokenRedisClient } = require("../services/redis");
      const connected = await connectBrokenRedis();
      assert.strictEqual(connected, false, "Broken Redis settings should fail closed and fall back");

      await brokenRedisClient.set("fallback:otp", "123456");
      assert.strictEqual(await brokenRedisClient.get("fallback:otp"), "123456", "Redis fallback should still store OTP data in memory");
    } finally {
      if (originalRedisUrl) {
        process.env.REDIS_URL = originalRedisUrl;
      } else {
        delete process.env.REDIS_URL;
      }
      delete require.cache[require.resolve("../services/redis")];
    }

    console.log("redis cache helpers test passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
