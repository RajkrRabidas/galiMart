require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/user.routes");
const { connectRedis } = require("../services/redis");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;