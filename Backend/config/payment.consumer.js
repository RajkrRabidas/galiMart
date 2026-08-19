const { getChannel } = require("../config/rabbitmq");
const orderModel = require("../models/order");
const cartModel = require("../models/cart.model");
const Rider = require("../models/rider.model");
const { emitRealtimeEvent } = require("../services/realtime.service");

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

      if (event.type !== "payment.success") {
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
          returnDocument: 'after',
        },
      );

      if (!order) {
        channel.ack(msg);
        return;
      }

      console.log("✔ order placed successfully", order._id);

      await cartModel.deleteMany({ userId: order.userId });

      emitRealtimeEvent({
        event: "order:new",
        room: `shop:${order.shopId}`,
        payload: {
          orderId: order._id,
        },
      });

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Payment consumer error ", error);
    }
  });
};

const startOrderConsumer = async () => {
  const channel = getChannel();

  if (!channel) {
    console.warn("RabbitMQ channel not initialized; order consumer skipped");
    return;
  }

  console.log("Starting to consume from", process.env.RIDER_READY_QUEUE);

  await channel.consume(process.env.RIDER_READY_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      console.log(
        "Received message from RIDER_READY_QUEUE:",
        msg.content.toString(),
      );

      const event = JSON.parse(msg.content.toString());

      console.log("event type:", event.type);

      if (event.type !== "order.ready_for_rider") {
        console.log("Ignoring event type:", event.type);
        channel.ack(msg);
        return;
      }

      const { orderId, shopId, shopName, location } = event.data;
      const order = await orderModel.findById(orderId);

      console.log(
        "Searching for rider nearby for order:",
        orderId,
        "at location:",
        location,
      );

      const riders = await Rider.find({
        isAvailable: true,
        isVerified: true,
        location: {
          $near: {
            $geometry: location,
            $maxDistance: 7000,
          },
        },
      });

      console.log(`found ${riders.length} nearby riders for order ${orderId}`);

      if (riders.length === 0) {
        console.log("No available riders found for order:", orderId);
        channel.ack(msg);
        return;
      }

      for (const rider of riders) {
        console.log(`Notifying rider ${rider._id} about order ${orderId}`);
        try {
          emitRealtimeEvent({
            event: "order:ready_for_rider",
            room: `rider:${rider._id}`,
            payload: {
              orderId: order?._id || orderId,
              shopId: order?.shopId || shopId,
              shopName: order?.shopName || shopName,
              location,
            },
          });
        } catch (err) {
          console.error(
            `Error notifying rider ${rider._id} about order ${orderId}:`,
            err,
          );
        }
      }

      channel.ack(msg);
      console.log("message acknowledged for order:", orderId);
    } catch (error) {
      console.error("❌ Order consumer error ", error);
    }
  });
};

module.exports = { startPaymentConsumer, startOrderConsumer };
