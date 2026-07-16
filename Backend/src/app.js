require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/user.routes");
const shopRouter = require("../routes/shop.routes")
const { connectRedis } = require("../services/redis");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/api/auth", authRouter);
app.use("/api/shop", shopRouter);

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;