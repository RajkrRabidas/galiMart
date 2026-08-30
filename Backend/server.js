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
    // Connect to critical services
    await connectToDB();
    console.log("✅ Database connected");

    // Initialize optional services (non-blocking)
    connectRabbitMQ()
      .then(() => {
        startPaymentConsumer();
        startOrderConsumer();
        console.log("✅ RabbitMQ consumers started");
      })
      .catch((err) => {
        console.warn("⚠️ RabbitMQ not available, continuing without message queue...");
      });

    initSocket(server);
    console.log("✅ WebSocket initialized");

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error.message);
    process.exit(1);
  }
};

bootstrap();

