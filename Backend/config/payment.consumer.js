const { getChannel } = require("../config/rabbitmq");
const orderModel = require("../models/order");

const startPaymentConsumer = async () => {
  const channel = getChannel();

  if (!channel) {
    console.warn("RabbitMQ channel not initialized; payment consumer skipped");
    return;
  }

  await channel.consume(process.env.PAYMENT_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      if (event.type !== "PAYMENT_SUCCESS") {
        channel.ack(msg);
        return;
      }

      const { orderId } = event.data;

      const order = await orderModel.findOneAndUpdate(
        {
          _id: orderId,
          paymentStatus: { $ne: "paid" },
        },
        {
          $set: {
            paymentStatus: "paid",
            status: "placed",
          },
          $unset: {
            expiresAt: 1,
          },
        },
        {
          new: true,
        }
      );

      if (!order) {
        channel.ack(msg);
        return;
      }

      console.log("✔ order placed successfully", order._id);

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Payment consumer error ", error);
    }
  });
};

module.exports = { startPaymentConsumer };