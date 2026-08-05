const { getChannel } = require("./rabbitmq");

const publishPaymentSuccess = async (paymentData) => {
  const channel = getChannel();

  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  channel.sendToQueue(
    process.env.PAYMENT_QUEUE,
    Buffer.from(JSON.stringify({ type: "payment.success", data: paymentData })),
    {
      persistent: true,
    },
  );
};

const publishOrderEvent = async (eventType, data) => {
  const channel = getChannel();

  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  // eventType must be a string, data can be any serializable object
  channel.sendToQueue(
    process.env.RIDER_READY_QUEUE,
    Buffer.from(JSON.stringify({ type: String(eventType), data })),
    {
      persistent: true,
    },
  );
};

module.exports = {publishPaymentSuccess, publishOrderEvent}