const assert = require("assert");
const allowRoles = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");

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
    const req = { user: { role: ROLES.ADMIN } };
    const res = makeRes();
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    await allowRoles(ROLES.ADMIN)(req, res, next);
    assert.strictEqual(nextCalled, true, "Admin role should pass");

    const forbiddenReq = { user: { role: ROLES.CUSTOMER } };
    const forbiddenRes = makeRes();
    let forbiddenCalled = false;
    const forbiddenNext = () => {
      forbiddenCalled = true;
    };

    const forbiddenResult = allowRoles(ROLES.ADMIN)(forbiddenReq, forbiddenRes, forbiddenNext);
    assert.strictEqual(forbiddenRes.statusCode, 403, "Customer role should be forbidden");
    assert.strictEqual(forbiddenCalled, false, "Forbidden requests should not proceed");
    assert.strictEqual(forbiddenResult?.success, false, "Forbidden request should return an error payload");

    console.log("authorization middleware tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
