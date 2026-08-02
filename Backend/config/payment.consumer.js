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

     axios.post(
    `${process.env.INTERNAL_API_URL}/api/realtime/emit`,
    {
      event: "order:new",
      room: `shop:${order.shopId}`,
      paymentData: {
        orderId: order._id,
      },
    },
    {
      headers: {
        "x-internal-key": process.env.INTERNAL_KEY,
      },
    },
  );

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
      console.log("Received message from RIDER_READY_QUEUE:", msg.content.toString());

      const event = JSON.parse(msg.content.toString());

      console.log("event type:", event.type);

      if (event.type !== "ORDER_READY_FOR_RIDER") {
        console.log("Ignoring event type:", event.type);
        channel.ack(msg);
        return;
      }

      const { orderId, shopId, shopName, location } = event.data; 

      console.log("Searching for rider nearby for order:", orderId, "at location:", location);

      const rider = await Rider.find({
        isAvailable: true,
        isVerified: true,
        location: {
          $near:{
            $geometry: location,
            $maxDistance: 7000 // 7 km
          }
        }
      })

      console.log(`found ${riders.length} nearby riders for order ${orderId}`);

      if (riders.length === 0) {
        console.log("No available riders found for order:", orderId);
        channel.ack(msg);
        return;
      }

      for (const rider of riders) {
        console.log(`Notifying rider ${rider._id} about order ${orderId}`);
        try{
          await axios.post(
          `${process.env.INTERNAL_API_URL}/api/realtime/emit`,
          {
            event: "order:ready_for_rider",
            room: `rider:${rider._id}`,
            paymentData: {
              orderId: order._id,
              shopId: order.shopId,
              shopName: order.shopName,
              location: order.location,
            },
          },
          {
            headers: {
              "x-internal-key": process.env.INTERNAL_KEY,
            },
          }
        );
        }catch(err){
          console.error(`Error notifying rider ${rider._id} about order ${orderId}:`, err);
        }
      }

      channel.ack(msg);
      console.log("message acknowledged for order:", orderId);
    } catch (error) {
      console.error("❌ Order consumer error ", error);
    }
  });

}

module.exports = { startPaymentConsumer, startOrderConsumer };