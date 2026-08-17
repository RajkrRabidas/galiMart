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

    console.log("redis cache helpers test passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
