const assert = require("assert");
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
    const req = { headers: {} };
    const res = makeRes();
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    verifyInternalAuth(req, res, next);
    assert.strictEqual(nextCalled, true, "Internal middleware should allow the request to continue");
    assert.strictEqual(res.statusCode, 200, "Middleware should not reject requests without internal JWTs");

    console.log("internal auth middleware tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
