const assert = require('assert');

const { calculateOrderSettlement } = require('../config/settlement');

const settlement = calculateOrderSettlement({
  subtotal: 250,
  platformFee: 7,
  deliveryFee: 0,
});

assert.strictEqual(settlement.sellerCommissionPercent, 10, 'seller commission percent should be configurable');
assert.strictEqual(settlement.sellerCommissionAmount, 25, '10% of ₹250 should be ₹25');
assert.strictEqual(settlement.sellerPayout, 225, 'seller payout should be subtotal minus commission');
assert.strictEqual(settlement.platformRevenue, 32, 'platform revenue should include commission plus platform fee');
assert.strictEqual(settlement.customerPayable, 257, 'customer payable should include subtotal and platform fee');

console.log('settlement math tests passed');
