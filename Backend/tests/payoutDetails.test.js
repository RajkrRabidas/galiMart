const assert = require("assert");
const crypto = require("crypto");

process.env.PAYMENT_DETAILS_ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
const {
  createStoredPayoutDetails,
  decryptPayoutDetails,
  normalizePayoutInput,
  toPublicPayoutDetails,
} = require("../utils/payoutDetails");

const bankInput = {
  method: "bank",
  accountHolderName: "  Gali   Mart Seller ",
  accountNumber: "001234567890",
  ifsc: "abcd0123456",
};
const storedBankDetails = createStoredPayoutDetails(bankInput);

assert.strictEqual(storedBankDetails.method, "bank");
assert.strictEqual(storedBankDetails.accountHolderName, "Gali Mart Seller");
assert.strictEqual(storedBankDetails.accountLast4, "7890");
assert.ok(!storedBankDetails.encryptedPayload.includes(bankInput.accountNumber));
assert.deepStrictEqual(decryptPayoutDetails(storedBankDetails).accountNumber, bankInput.accountNumber);
assert.deepStrictEqual(toPublicPayoutDetails(storedBankDetails), {
  method: "bank",
  accountHolderName: "Gali Mart Seller",
  accountLast4: "7890",
  upiIdMasked: null,
  updatedAt: storedBankDetails.updatedAt,
});

const storedUpiDetails = createStoredPayoutDetails({
  method: "upi",
  accountHolderName: "Rider Name",
  upiId: "rider.name@okbank",
});
assert.strictEqual(storedUpiDetails.upiIdMasked, "ri******@okbank");
assert.deepStrictEqual(decryptPayoutDetails(storedUpiDetails).upiId, "rider.name@okbank");

assert.throws(() => normalizePayoutInput({ method: "upi", accountHolderName: "Rider", upiId: "not-an-upi" }), /valid UPI ID/);
assert.throws(() => normalizePayoutInput({ method: "bank", accountHolderName: "Seller", accountNumber: "123", ifsc: "BAD" }), /account number/);

const configuredKey = process.env.PAYMENT_DETAILS_ENCRYPTION_KEY;
process.env.PAYMENT_DETAILS_ENCRYPTION_KEY = "replace-with-a-generated-64-character-hex-key";
assert.throws(() => createStoredPayoutDetails(bankInput), (error) => error.statusCode === 503);
process.env.PAYMENT_DETAILS_ENCRYPTION_KEY = configuredKey;

console.log("payout details encryption tests passed");
