const app = require("./src/app");
const PORT = process.env.PORT || 3000;
const connectToDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const { startPaymentConsumer, startOrderConsumer } = require("./config/payment.consumer");
const { initSocket } = require("./services/socket");
const http = require("http")

const server = http.createServer(app)

const bootstrap = async () => {
  try {
    await connectRabbitMQ();
    await startPaymentConsumer();
    await startOrderConsumer();
    initSocket(server);
    await connectToDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed", error);
    process.exit(1);
  }
};

bootstrap();

