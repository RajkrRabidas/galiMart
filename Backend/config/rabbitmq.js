const amqp = require("amqplib");

let channel = null;

const connectRabbitMQ = async () => {
    try {
        if (!process.env.RABBITMQ_URL) {
            console.warn("RabbitMQ URL not configured; payment consumer disabled");
            return null;
        }

        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue(process.env.PAYMENT_QUEUE, { durable: true });

        console.log("Connected to RabbitMQ");
        return channel;
    } catch (error) {
        console.warn("RabbitMQ unavailable; payment consumer disabled", error.message);
        return null;
    }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };