const { getChannel } = require("./rabbitmq");

const publishPaymentSuccess = async (paymentData) => {
  const channel = getChannel();

  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  channel.sendToQueue(
    process.env.PAYMENT_SUCCESS_QUEUE,
    Buffer.from(JSON.stringify({ type: "PAYMENT_SUCCESS", data: paymentData })),
    {
      persistent: true,
    },
  );
};

module.exports = {publishPaymentSuccess}