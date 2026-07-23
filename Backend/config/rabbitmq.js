const amqp = require("amqplib");

let channel = null;

const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(process.env.PAYMENT_QUEUE, { durable: true });

    console.log("Connected to RabbitMQ");
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };