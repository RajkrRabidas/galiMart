require("dotenv").config();
const express = require("express");
const authRouter = require("../routes/user.routes");
const { connectRedis } = require("../services/redis");

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;