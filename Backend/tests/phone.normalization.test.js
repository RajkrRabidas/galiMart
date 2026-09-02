const assert = require("assert");
const userModel = require("../models/user.model");

const normalizePhone = userModel.normalizePhone;

assert.strictEqual(typeof normalizePhone, "function", "normalizePhone helper should exist");
assert.strictEqual(normalizePhone("0987654321"), "987654321");
assert.strictEqual(normalizePhone("987654321"), "987654321");
assert.strictEqual(normalizePhone("+91 9876543210"), "9876543210");
assert.strictEqual(normalizePhone("919876543210"), "9876543210");
assert.strictEqual(normalizePhone(""), "");

const saveHooks = userModel.schema.s.hooks._pres.get("save");
const customSaveHook = saveHooks.find((hook) => hook.fn && hook.fn.toString().includes("this.phone"));

assert.ok(customSaveHook, "custom save hook should be registered");
assert.doesNotThrow(() => customSaveHook.fn.call({ phone: "0987654321" }), "save hook should tolerate missing next callback");
assert.strictEqual(normalizePhone("0987654321"), "987654321");

console.log("phone normalization tests passed");
