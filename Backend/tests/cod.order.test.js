const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const backendPath = path.resolve(__dirname, "..");
const orderControllerPath = path.join(backendPath, "controllers/order.controller.js");
const riderControllerPath = path.join(backendPath, "controllers/rider.controller.js");
const modulePaths = {
  address: path.join(backendPath, "models/userDetails.model.js"),
  cart: path.join(backendPath, "models/cart.model.js"),
  shop: path.join(backendPath, "models/shop.model.js"),
  menu: path.join(backendPath, "models/shopMenu.model.js"),
  order: path.join(backendPath, "models/order.js"),
  rider: path.join(backendPath, "models/rider.model.js"),
  producer: path.join(backendPath, "config/payment.producer.js"),
  realtime: path.join(backendPath, "services/realtime.service.js"),
  socket: path.join(backendPath, "services/socket.js"),
};

const previousModules = Object.fromEntries(
  Object.entries(modulePaths).map(([key, filename]) => [key, require.cache[filename]]),
);
const previousControllers = {
  order: require.cache[orderControllerPath],
  rider: require.cache[riderControllerPath],
};

let createdOrderData;
let cartDeleteCalls;
let emittedEvents;
let orderFilters;
let activeOrder;

const address = {
  _id: "address-1",
  fullName: "Asha Kumar",
  formattedAddress: "12 Market Road",
  mobile: 9876543210,
};
const shopData = {
  _id: "shop-1",
  name: "Gali Mart Shop",
  phone: "9876543210",
  isOpen: true,
  autoLocation: { formattedAddress: "Shop Road" },
};
const cartItems = [
  {
    quantity: 2,
    itemId: { _id: "item-1", name: "Apples", price: 50, image: "apple.jpg" },
    shopId: shopData,
  },
];

const makeQuery = (records = []) => ({
  populate() { return this; },
  select() { return this; },
  sort() { return this; },
  limit() { return Promise.resolve(records); },
  lean() { return Promise.resolve(records); },
  then(resolve, reject) { return Promise.resolve(records).then(resolve, reject); },
});

const mockModule = (filename, exports) => {
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports,
  };
};

const setupControllers = () => {
  createdOrderData = null;
  cartDeleteCalls = [];
  emittedEvents = [];
  orderFilters = [];
  activeOrder = null;

  mockModule(modulePaths.address, {
    findOne: async () => address,
  });
  mockModule(modulePaths.cart, {
    find: () => makeQuery(cartItems),
    deleteMany: async (filter) => {
      cartDeleteCalls.push(filter);
      return { deletedCount: cartItems.length };
    },
  });
  mockModule(modulePaths.shop, {
    findById: async () => shopData,
    find: () => makeQuery([]),
  });
  mockModule(modulePaths.menu, {
    find: () => makeQuery([]),
  });
  mockModule(modulePaths.order, {
    create: async (data) => {
      createdOrderData = data;
      return {
        _id: "order-1",
        shopId: data.shopId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
      };
    },
    find: (filter) => {
      orderFilters.push(filter);
      return makeQuery([]);
    },
    findById: async () => activeOrder,
  });
  mockModule(modulePaths.rider, {
    findOne: async () => ({ _id: "rider-1" }),
  });
  mockModule(modulePaths.producer, {
    publishOrderEvent: async () => ({ success: true }),
  });
  mockModule(modulePaths.realtime, {
    emitRealtimeEvent: (event) => emittedEvents.push(event),
  });
  mockModule(modulePaths.socket, {
    getIO: () => ({ emit() {} }),
  });

  delete require.cache[orderControllerPath];
  delete require.cache[riderControllerPath];

  return {
    orderController: require(orderControllerPath),
    riderController: require(riderControllerPath),
  };
};

const makeResponse = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

const callWrappedHandler = (handler, req) => new Promise((resolve, reject) => {
  const res = makeResponse();
  res.json = (body) => {
    res.body = body;
    resolve(res);
    return res;
  };
  handler(req, res, reject);
});

test("COD order creation keeps payment pending, skips expiry, clears cart, and notifies shop", async () => {
  const { orderController } = setupControllers();
  const res = await callWrappedHandler(
    orderController.createOrder,
    { user: { _id: "user-1" }, body: { paymentMethod: "cod", addressId: "address-1" } },
  );

  assert.equal(res.statusCode, 201);
  assert.equal(createdOrderData.paymentMethod, "cod");
  assert.equal(createdOrderData.paymentStatus, "pending");
  assert.equal(createdOrderData.status, "placed");
  assert.equal(Object.hasOwn(createdOrderData, "expiresAt"), false);
  assert.deepEqual(cartDeleteCalls, [{ userId: "user-1" }]);
  assert.equal(emittedEvents[0].event, "order:new");
  assert.equal(emittedEvents[0].room, "shop:shop-1");
});

test("customer, seller, and rider order queries include unpaid COD orders", async () => {
  const { orderController, riderController } = setupControllers();

  await callWrappedHandler(
    orderController.getMyOrders,
    { user: { _id: "user-1" } },
  );
  await callWrappedHandler(
    orderController.fetchShopOrders,
    { user: { _id: "seller-1" }, params: { shopId: "shop-1" }, query: {} },
  );
  await riderController.fetchAvailableOrders(
    { user: { _id: "rider-user-1" } },
    makeResponse(),
  );

  assert.equal(orderFilters.length, 3);
  for (const filter of orderFilters) {
    assert.ok(
      filter.$or.some(
        (condition) => condition.paymentMethod === "cod" && condition.paymentStatus === "pending",
      ),
      "the order query should include pending COD orders",
    );
  }
});

test("rider must confirm COD cash collection before completing delivery", async () => {
  const { riderController } = setupControllers();
  let saveCalls = 0;
  const rider = { _id: "rider-1" };
  activeOrder = {
    _id: "order-1",
    riderId: rider._id,
    shopId: "shop-1",
    userId: "user-1",
    status: "picked_up",
    paymentMethod: "cod",
    paymentStatus: "pending",
    async save() { saveCalls += 1; },
  };
  const res = makeResponse();

  // This route looks up a rider by userId; the model mock is replaced for this assertion.
  const riderModelPath = modulePaths.rider;
  const previousRiderModel = require.cache[riderModelPath];
  mockModule(riderModelPath, { findOne: async () => rider });
  delete require.cache[riderControllerPath];
  const controller = require(riderControllerPath);

  try {
    await controller.updateOrderStatus(
      { user: { _id: "rider-user-1" }, params: { orderId: "order-1" }, body: {} },
      res,
    );

    assert.equal(res.statusCode, 400);
    assert.equal(activeOrder.status, "picked_up");
    assert.equal(activeOrder.paymentStatus, "pending");
    assert.equal(saveCalls, 0);

    await controller.updateOrderStatus(
      {
        user: { _id: "rider-user-1" },
        params: { orderId: "order-1" },
        body: { cashCollected: true },
      },
      makeResponse(),
    );

    assert.equal(activeOrder.status, "delivered");
    assert.equal(activeOrder.paymentStatus, "paid");
    assert.equal(saveCalls, 1);
  } finally {
    if (previousRiderModel) require.cache[riderModelPath] = previousRiderModel;
    else delete require.cache[riderModelPath];
    delete require.cache[riderControllerPath];
  }
});

test.after(() => {
  for (const [key, filename] of Object.entries(modulePaths)) {
    if (previousModules[key]) require.cache[filename] = previousModules[key];
    else delete require.cache[filename];
  }
  if (previousControllers.order) require.cache[orderControllerPath] = previousControllers.order;
  else delete require.cache[orderControllerPath];
  if (previousControllers.rider) require.cache[riderControllerPath] = previousControllers.rider;
  else delete require.cache[riderControllerPath];
});