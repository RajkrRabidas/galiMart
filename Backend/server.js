const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const connectToDB = require("./config/db");
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startPaymentConsumer } = require('./config/payment.consumer');


const start = async () => {
    await connectRabbitMQ();
    await startPaymentConsumer();
    connectToDB();
    app.listen(PORT, () => {
        console.log("server is running 3000...");
    });
};

start();