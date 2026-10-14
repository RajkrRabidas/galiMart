const crypto = require("crypto");

const getEncryptionKey = () => {
  const key = process.env.PAYMENT_DETAILS_ENCRYPTION_KEY || "";
  if (!/^[a-f\d]{64}$/i.test(key)) {
    const error = new Error("Payout encryption is not configured. Set PAYMENT_DETAILS_ENCRYPTION_KEY to 64 hexadecimal characters.");
    error.statusCode = 503;
    throw error;
  }

  return Buffer.from(key, "hex");
};

const normalizePayoutInput = (input = {}) => {
  const method = String(input.method || "").trim().toLowerCase();
  const accountHolderName = String(input.accountHolderName || "").trim().replace(/\s+/g, " ");

  if (!accountHolderName || accountHolderName.length > 100) {
    throw Object.assign(new Error("Enter the account holder's name (up to 100 characters)."), { statusCode: 400 });
  }

  if (method === "upi") {
    const upiId = String(input.upiId || "").trim().toLowerCase();
    if (!/^[a-z\d._-]{2,64}@[a-z\d.-]{2,64}$/i.test(upiId)) {
      throw Object.assign(new Error("Enter a valid UPI ID."), { statusCode: 400 });
    }

    const [handle, provider] = upiId.split("@");
    const maskedHandle = handle.length <= 2 ? `${handle[0]}*` : `${handle.slice(0, 2)}${"*".repeat(Math.min(handle.length - 2, 6))}`;
    return {
      method,
      accountHolderName,
      sensitive: { upiId },
      upiIdMasked: `${maskedHandle}@${provider}`,
      accountLast4: null,
    };
  }

  if (method === "bank") {
    const accountNumber = String(input.accountNumber || "").replace(/\s/g, "");
    const ifsc = String(input.ifsc || "").trim().toUpperCase();
    if (!/^\d{8,20}$/.test(accountNumber)) {
      throw Object.assign(new Error("Enter a bank account number with 8–20 digits."), { statusCode: 400 });
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      throw Object.assign(new Error("Enter a valid 11-character IFSC code."), { statusCode: 400 });
    }

    return {
      method,
      accountHolderName,
      sensitive: { accountNumber, ifsc },
      upiIdMasked: null,
      accountLast4: accountNumber.slice(-4),
    };
  }

  throw Object.assign(new Error("Choose UPI or bank transfer."), { statusCode: 400 });
};

const encryptPayoutPayload = (payload) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);

  return [iv.toString("hex"), cipher.getAuthTag().toString("hex"), encrypted.toString("hex")].join(":");
};

const decryptPayoutPayload = (ciphertext) => {
  if (typeof ciphertext !== "string") return null;
  const [ivHex, tagHex, dataHex] = ciphertext.split(":");
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error("Stored payout details could not be decrypted.");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8"));
};

const createStoredPayoutDetails = (input) => {
  const normalized = normalizePayoutInput(input);
  return {
    method: normalized.method,
    accountHolderName: normalized.accountHolderName,
    accountLast4: normalized.accountLast4,
    upiIdMasked: normalized.upiIdMasked,
    encryptedPayload: encryptPayoutPayload(normalized.sensitive),
    updatedAt: new Date(),
  };
};

const toPublicPayoutDetails = (details) => {
  if (!details?.method) return null;
  return {
    method: details.method,
    accountHolderName: details.accountHolderName,
    accountLast4: details.accountLast4 || null,
    upiIdMasked: details.upiIdMasked || null,
    updatedAt: details.updatedAt || null,
  };
};

const decryptPayoutDetails = (details) => {
  if (!details?.method || !details.encryptedPayload) return null;
  return {
    method: details.method,
    accountHolderName: details.accountHolderName,
    ...decryptPayoutPayload(details.encryptedPayload),
    updatedAt: details.updatedAt || null,
  };
};

module.exports = {
  createStoredPayoutDetails,
  decryptPayoutDetails,
  normalizePayoutInput,
  toPublicPayoutDetails,
};
