const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

const consumerPath = path.resolve(__dirname, '../config/payment.consumer.js');

test('startPaymentConsumer skips cleanly when RabbitMQ channel is not initialized', async () => {
  const originalLoad = Module._load;

  Module._load = function (request, parent, isMain) {
    if (request === '../config/rabbitmq') {
      return { getChannel: () => null };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  delete require.cache[consumerPath];

  try {
    const { startPaymentConsumer } = require('../config/payment.consumer');

    await assert.doesNotReject(startPaymentConsumer());
  } finally {
    Module._load = originalLoad;
    delete require.cache[consumerPath];
  }
});
