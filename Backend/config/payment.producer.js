const { getChannel } = require("./rabbitmq");

const publishPaymentSuccess = async (paymentData) => {
  try {
    const channel = getChannel();

    if (!channel) {
      console.warn("⚠️ RabbitMQ channel not available. Payment event skipped (will be handled by DB):", paymentData);
      return { success: false, reason: "RabbitMQ unavailable" };
    }

    channel.sendToQueue(
      process.env.PAYMENT_QUEUE,
      Buffer.from(JSON.stringify({ type: "payment.success", data: paymentData })),
      {
        persistent: true,
      },
    );
    console.log("✅ Payment success event published");
    return { success: true };
  } catch (error) {
    console.error("❌ Error publishing payment success:", error.message);
    return { success: false, error: error.message };
  }
};

const publishOrderEvent = async (eventType, data) => {
  try {
    const channel = getChannel();

    if (!channel) {
      console.warn("⚠️ RabbitMQ channel not available. Order event skipped:", eventType, data);
      return { success: false, reason: "RabbitMQ unavailable" };
    }

    // eventType must be a string, data can be any serializable object
    channel.sendToQueue(
      process.env.RIDER_READY_QUEUE,
      Buffer.from(JSON.stringify({ type: String(eventType), data })),
      {
        persistent: true,
      },
    );
    console.log("✅ Order event published:", eventType);
    return { success: true };
  } catch (error) {
    console.error("❌ Error publishing order event:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { publishPaymentSuccess, publishOrderEvent };