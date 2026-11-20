const assert = require("assert");

const rabbitmqPath = require.resolve("../config/rabbitmq");
const orderModelPath = require.resolve("../models/order");
const cartModelPath = require.resolve("../models/cart.model");
const riderModelPath = require.resolve("../models/rider.model");
const realtimePath = require.resolve("../services/realtime.service");
const consumerPath = require.resolve("../config/payment.consumer");
const originalModules = {
  rabbitmq: require.cache[rabbitmqPath],
  orderModel: require.cache[orderModelPath],
  cartModel: require.cache[cartModelPath],
  riderModel: require.cache[riderModelPath],
  realtime: require.cache[realtimePath],
  consumer: require.cache[consumerPath],
};
const previousQueue = process.env.RIDER_READY_QUEUE;

(async () => {
  try {
    process.env.RIDER_READY_QUEUE = "test-rider-ready";

    let deliveryHandler;
    let ackCount = 0;
    let nackCount = 0;
    const channel = {
      consume: async (_queue, handler) => {
        deliveryHandler = handler;
      },
      ack: () => {
        ackCount += 1;
      },
      nack: () => {
        nackCount += 1;
      },
    };

    const findQueries = [];
    const riders = [{
      _id: "rider-1",
    }];
    const riderModel = {
      find: (query) => {
        findQueries.push(query);
        return {
          sort: () => ({
            limit: async () => riders,
          }),
          then: (resolve, reject) => Promise.resolve(riders).then(resolve, reject),
        };
      },
    };

    require.cache[rabbitmqPath] = {
      id: rabbitmqPath,
      filename: rabbitmqPath,
      loaded: true,
      exports: { getChannel: () => channel },
    };
    require.cache[orderModelPath] = {
      id: orderModelPath,
      filename: orderModelPath,
      loaded: true,
      exports: { findById: async () => ({}) },
    };
    require.cache[cartModelPath] = {
      id: cartModelPath,
      filename: cartModelPath,
      loaded: true,
      exports: {},
    };
    require.cache[riderModelPath] = {
      id: riderModelPath,
      filename: riderModelPath,
      loaded: true,
      exports: riderModel,
    };
    require.cache[realtimePath] = {
      id: realtimePath,
      filename: realtimePath,
      loaded: true,
      exports: { emitRealtimeEvent: () => {} },
    };

    delete require.cache[consumerPath];
    const { startOrderConsumer } = require("../config/payment.consumer");
    await startOrderConsumer();

    const message = {
      content: Buffer.from(JSON.stringify({
        type: "order_ready_for_rider",
        data: {
          orderId: "order-1",
          shopId: "shop-1",
          shopName: "Test shop",
          location: {
            formattedAddress: "Bauria, Howrah",
          },
        },
      })),
    };
    await deliveryHandler(message);

    assert.strictEqual(findQueries.length, 1, "missing coordinates should skip the geospatial query");
    assert.strictEqual(findQueries[0].location, undefined, "fallback query should not use invalid coordinates");
    assert.strictEqual(ackCount, 1, "message should be acknowledged after fallback rider lookup");
    assert.strictEqual(nackCount, 0, "missing coordinates should not cause the message to be requeued");

    console.log("order consumer tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (previousQueue === undefined) delete process.env.RIDER_READY_QUEUE;
    else process.env.RIDER_READY_QUEUE = previousQueue;

    for (const [name, path] of Object.entries({
      rabbitmq: rabbitmqPath,
      orderModel: orderModelPath,
      cartModel: cartModelPath,
      riderModel: riderModelPath,
      realtime: realtimePath,
      consumer: consumerPath,
    })) {
      if (originalModules[name]) require.cache[path] = originalModules[name];
      else delete require.cache[path];
    }
  }
})();
