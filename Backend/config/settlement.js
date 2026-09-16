const SELLER_COMMISSION_PERCENT = 10;
const PLATFORM_FEE_RUPEES = 7;
const FREE_DELIVERY_THRESHOLD_RUPEES = 300;
const DELIVERY_FEE_RUPEES = 30;

const moneyToPaise = (value = 0) => Math.round(Number(value || 0) * 100);
const moneyFromPaise = (value = 0) => Math.round(Number(value || 0) / 100);

const calculateOrderSettlement = ({
  subtotal = 0,
  platformFee = 0,
  deliveryFee = 0,
  riderPayout = 0,
  riderIncentive = 0,
  sellerCommissionPercent = SELLER_COMMISSION_PERCENT,
}) => {
  const subtotalPaise = moneyToPaise(subtotal);
  const platformFeePaise = moneyToPaise(platformFee);
  const deliveryFeePaise = moneyToPaise(deliveryFee);
  const riderPayoutPaise = moneyToPaise(riderPayout);
  const riderIncentivePaise = moneyToPaise(riderIncentive);

  const effectiveSellerCommissionPercent = Number(sellerCommissionPercent || SELLER_COMMISSION_PERCENT);
  const sellerCommissionAmountPaise = Math.round((subtotalPaise * effectiveSellerCommissionPercent) / 100);
  const sellerPayoutPaise = subtotalPaise - sellerCommissionAmountPaise;
  const platformRevenuePaise = sellerCommissionAmountPaise + platformFeePaise;
  const customerPayablePaise = subtotalPaise + platformFeePaise + deliveryFeePaise;

  return {
    subtotal,
    platformFee,
    deliveryFee,
    customerPayable: moneyFromPaise(customerPayablePaise),
    sellerCommissionPercent: effectiveSellerCommissionPercent,
    sellerCommissionAmount: moneyFromPaise(sellerCommissionAmountPaise),
    sellerPayout: moneyFromPaise(sellerPayoutPaise),
    riderPayout: moneyFromPaise(riderPayoutPaise),
    riderIncentive: moneyFromPaise(riderIncentivePaise),
    platformRevenue: moneyFromPaise(platformRevenuePaise),
    paymentStatus: "pending",
    settlementStatus: "pending",
  };
};

const applyRefundToSettlement = (settlement, refundAmount = 0) => {
  if (!settlement) return null;

  const refundAmountPaise = moneyToPaise(refundAmount);
  const customerPayablePaise = moneyToPaise(settlement.customerPayable || 0);

  if (!refundAmountPaise || !customerPayablePaise) {
    return {
      ...settlement,
      refundAmount: 0,
      settlementStatus: settlement.settlementStatus || "pending",
    };
  }

  const refundRatio = refundAmountPaise / customerPayablePaise;
  const sellerPayoutPaise = moneyToPaise(settlement.sellerPayout || 0);
  const platformRevenuePaise = moneyToPaise(settlement.platformRevenue || 0);
  const refundedSellerPayoutPaise = Math.round(sellerPayoutPaise * refundRatio);
  const refundedPlatformRevenuePaise = Math.round(platformRevenuePaise * refundRatio);

  return {
    ...settlement,
    refundAmount: moneyFromPaise(refundAmountPaise),
    sellerPayout: moneyFromPaise(Math.max(0, sellerPayoutPaise - refundedSellerPayoutPaise)),
    platformRevenue: moneyFromPaise(Math.max(0, platformRevenuePaise - refundedPlatformRevenuePaise)),
    settlementStatus: refundAmountPaise >= customerPayablePaise ? "refunded" : "partial_refund",
  };
};

module.exports = {
  SELLER_COMMISSION_PERCENT,
  PLATFORM_FEE_RUPEES,
  FREE_DELIVERY_THRESHOLD_RUPEES,
  DELIVERY_FEE_RUPEES,
  calculateOrderSettlement,
  applyRefundToSettlement,
};
