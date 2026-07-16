require("dotenv").config();
const express = require("express");

const cors = require("cors");
const authRouter = require("../routes/user.routes");
const { connectRedis } = require("../services/redis");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;