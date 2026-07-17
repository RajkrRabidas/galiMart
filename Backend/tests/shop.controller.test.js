const assert = require("assert");

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
  const shopModelPath = require.resolve("../models/shop.model");
  const cloudinaryPath = require.resolve("../utils/cloudinary");
  let originalShopModel = require.cache[shopModelPath];
  let originalCloudinary = require.cache[cloudinaryPath];

  try {

    const updates = [];

    require.cache[shopModelPath] = {
      id: shopModelPath,
      filename: shopModelPath,
      loaded: true,
      exports: {
        findOne: async (filter) => {
          if (filter._id === "shop123") {
            return { _id: "shop123", name: "Old Shop", ownerId: "user123", autoLocation: { coordinates: [0, 0], formattedAddress: "" } };
          }

          return null;
        },
        findOneAndUpdate: async (filter, update) => {
          updates.push({ filter, update });
          return { _id: "shop123", name: "Updated Shop" };
        },
      },
    };

    require.cache[cloudinaryPath] = {
      id: cloudinaryPath,
      filename: cloudinaryPath,
      loaded: true,
      exports: async () => "https://cloudinary.example.com/image.jpg",
    };

    delete require.cache[require.resolve("../controllers/shop.controller")];
    const { updateShop } = require("../controllers/shop.controller");

    const req = {
      params: { shopId: "shop123" },
      body: {
        name: "ABC",
        description: "Updated description",
        latitude: "22.57",
        longitude: "88.36",
      },
      user: { _id: "user123" },
    };
    const res = makeRes();

    await updateShop(req, res);

    assert.strictEqual(updates.length, 1, "updateShop should call the shop model once");
    assert.strictEqual(updates[0].update.name, "ABC", "name should be updated");
    assert.strictEqual(updates[0].update.description, "Updated description", "description should be preserved when present");
    assert.deepStrictEqual(updates[0].update.autoLocation.coordinates, [88.36, 22.57], "coordinates should be numeric");
    assert.strictEqual(typeof updates[0].update.autoLocation.coordinates[0], "number", "longitude should be a number");

    console.log("shop controller tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (originalShopModel) {
      require.cache[shopModelPath] = originalShopModel;
    } else {
      delete require.cache[shopModelPath];
    }

    if (originalCloudinary) {
      require.cache[cloudinaryPath] = originalCloudinary;
    } else {
      delete require.cache[cloudinaryPath];
    }
  }
})();
