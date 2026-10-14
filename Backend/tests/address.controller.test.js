const assert = require("assert");
const mongoose = require("mongoose");

const userDetailsPath = require.resolve("../models/userDetails.model");
const previousUserDetailsModule = require.cache[userDetailsPath];
const records = [];

const matches = (record, filter) => Object.entries(filter).every(([key, value]) => {
  if (key === "_id" && value && typeof value === "object" && value.$ne) return String(record._id) !== String(value.$ne);
  return String(record[key]) === String(value);
});
const query = (getRecords) => ({
  sort: async (sortOptions = {}) => {
    const result = getRecords();
    return result.sort((a, b) => {
      for (const [key, direction] of Object.entries(sortOptions)) {
        const comparison = String(a[key] || "").localeCompare(String(b[key] || ""));
        if (comparison) return comparison * direction;
      }
      return 0;
    })[0] || null;
  },
  then: (resolve, reject) => Promise.resolve(getRecords()[0] || null).then(resolve, reject),
});

const fakeModel = {
  exists: async (filter) => records.some((record) => matches(record, filter)),
  create: async (data) => {
    if (data.isDefault && records.some((record) => record.userId === data.userId && record.isDefault)) {
      const error = new Error("duplicate default");
      error.code = 11000;
      throw error;
    }
    const record = { _id: new mongoose.Types.ObjectId(), createdAt: new Date(), ...data };
    records.push(record);
    return record;
  },
  find: (filter) => ({
    sort: async (sortOptions = {}) => {
      const result = records.filter((record) => matches(record, filter));
      return result.sort((a, b) => {
        for (const [key, direction] of Object.entries(sortOptions)) {
          const comparison = String(a[key] || "").localeCompare(String(b[key] || ""));
          if (comparison) return comparison * direction;
        }
        return 0;
      });
    },
  }),
  findOne: (filter) => query(() => records.filter((record) => matches(record, filter))),
  findOneAndUpdate: async (filter, update) => {
    const record = records.find((item) => matches(item, filter));
    if (!record) return null;
    Object.assign(record, update.$set || update);
    return record;
  },
  updateMany: async (filter, update) => {
    const found = records.filter((record) => matches(record, filter));
    found.forEach((record) => Object.assign(record, update.$set || update));
    return { modifiedCount: found.length };
  },
  deleteOne: async (filter) => {
    const index = records.findIndex((record) => matches(record, filter));
    if (index < 0) return { deletedCount: 0 };
    records.splice(index, 1);
    return { deletedCount: 1 };
  },
};

require.cache[userDetailsPath] = {
  id: userDetailsPath,
  filename: userDetailsPath,
  loaded: true,
  exports: fakeModel,
};
const controllerPath = require.resolve("../controllers/address.controller");
delete require.cache[controllerPath];
const {
  addAddress,
  listAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} = require("../controllers/address.controller");

const makeResponse = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});
const userId = new mongoose.Types.ObjectId().toString();
const otherUserId = new mongoose.Types.ObjectId().toString();
const validAddress = (overrides = {}) => ({
  fullName: "  Asha Kumar  ",
  phoneNumber: "+91 98765 43210",
  pinCode: "560001",
  city: "Bengaluru",
  state: "Karnataka",
  locality: "MG Road",
  buildingName: "Flat 4B",
  landmark: "Near the park",
  addressType: "Home",
  ...overrides,
});
const call = async (handler, { user = userId, params = {}, body = {} } = {}) => {
  const res = makeResponse();
  await handler({ user: user ? { _id: user } : null, params, body }, res);
  return res;
};

(async () => {
  try {
    assert.strictEqual((await call(addAddress, { user: null, body: validAddress() })).statusCode, 401);
    assert.strictEqual((await call(addAddress, { body: validAddress({ pinCode: "12345" }) })).statusCode, 400);
    assert.strictEqual((await call(addAddress, { body: validAddress({ phoneNumber: "1234567890" }) })).statusCode, 400);
    assert.strictEqual((await call(addAddress, { body: { ...validAddress(), userId: otherUserId } })).statusCode, 400);
    assert.strictEqual(records.length, 0, "invalid requests must not create records");

    const createdFirst = await call(addAddress, { body: validAddress() });
    assert.strictEqual(createdFirst.statusCode, 201);
    assert.strictEqual(createdFirst.body.address.userId, userId, "owner must come from authentication");
    assert.strictEqual(createdFirst.body.address.fullName, "Asha Kumar", "strings should be trimmed");
    assert.strictEqual(createdFirst.body.address.phoneNumber, "+919876543210");
    assert.strictEqual(createdFirst.body.address.isDefault, true, "first address should be default");
    assert.match(createdFirst.body.address.formattedAddress, /560001$/);

    const createdSecond = await call(addAddress, { body: validAddress({ addressType: "Work", buildingName: "Office 12" }) });
    assert.strictEqual(createdSecond.statusCode, 201);
    assert.strictEqual(createdSecond.body.address.isDefault, false);

    const list = await call(listAddresses);
    assert.strictEqual(list.body.addresses.length, 2);
    assert.strictEqual((await call(getAddress, { user: otherUserId, params: { id: createdFirst.body.address._id } })).statusCode, 404);
    assert.strictEqual((await call(updateAddress, { user: otherUserId, params: { id: createdFirst.body.address._id }, body: validAddress() })).statusCode, 404);
    assert.strictEqual((await call(deleteAddress, { user: otherUserId, params: { id: createdFirst.body.address._id } })).statusCode, 404);
    assert.strictEqual((await call(setDefaultAddress, { user: otherUserId, params: { id: createdFirst.body.address._id } })).statusCode, 404);

    const updated = await call(updateAddress, {
      params: { id: createdSecond.body.address._id },
      body: validAddress({ city: "Mysuru", addressType: "Work" }),
    });
    assert.strictEqual(updated.statusCode, 200);
    assert.strictEqual(updated.body.address.city, "Mysuru");

    const madeDefault = await call(setDefaultAddress, { params: { id: createdSecond.body.address._id } });
    assert.strictEqual(madeDefault.statusCode, 200);
    assert.strictEqual((await call(getDefaultAddress)).body.address._id.toString(), createdSecond.body.address._id.toString());
    assert.strictEqual(records.filter((record) => record.userId === userId && record.isDefault).length, 1);

    const deleted = await call(deleteAddress, { params: { id: createdSecond.body.address._id } });
    assert.strictEqual(deleted.statusCode, 200);
    assert.strictEqual(records.find((record) => record.userId === userId).isDefault, true, "deleting default should promote remaining address");
    assert.strictEqual((await call(getDefaultAddress)).body.address._id.toString(), createdFirst.body.address._id.toString());

    console.log("address controller tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (previousUserDetailsModule) require.cache[userDetailsPath] = previousUserDetailsModule;
    else delete require.cache[userDetailsPath];
    delete require.cache[controllerPath];
  }
})();
