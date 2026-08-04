const assert = require("assert");
const jwt = require("jsonwebtoken");
const { verifyInternalAuth } = require("../middlewares/internalAuth.middleware");

const makeRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => body;
  return res;
};

(async () => {
  try {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

    const validReq = {
      headers: {
        authorization: `Bearer ${jwt.sign(
          { type: "internal", service: "backend" },
          process.env.JWT_SECRET,
          { expiresIn: "5m" },
        )}`,
      },
    };
    const validRes = makeRes();
    let validNextCalled = false;
    const validNext = () => {
      validNextCalled = true;
    };

    verifyInternalAuth(validReq, validRes, validNext);
    assert.strictEqual(validNextCalled, true, "Valid internal JWT should pass");

    const invalidReq = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };
    const invalidRes = makeRes();
    let invalidNextCalled = false;
    const invalidNext = () => {
      invalidNextCalled = true;
    };

    verifyInternalAuth(invalidReq, invalidRes, invalidNext);
    assert.strictEqual(invalidRes.statusCode, 403, "Invalid token should be rejected");
    assert.strictEqual(invalidNextCalled, false, "Invalid token should not continue");

    console.log("internal auth middleware tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
