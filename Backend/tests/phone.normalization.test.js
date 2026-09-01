const assert = require("assert");
const userModel = require("../models/user.model");

const normalizePhone = userModel.normalizePhone;

assert.strictEqual(typeof normalizePhone, "function", "normalizePhone helper should exist");
assert.strictEqual(normalizePhone("0987654321"), "987654321");
assert.strictEqual(normalizePhone("987654321"), "987654321");
assert.strictEqual(normalizePhone("+91 9876543210"), "9876543210");
assert.strictEqual(normalizePhone("919876543210"), "9876543210");
assert.strictEqual(normalizePhone(""), "");

console.log("phone normalization tests passed");
