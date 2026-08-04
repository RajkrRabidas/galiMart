require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/user.routes");
const addressRoutes = require("../routes/address.routes")
const shopRouter = require("../routes/shop.routes")
const { connectRedis } = require("../services/redis");
const menuRouter = require("../routes/menuItem.routes")
const cartRouter = require("../routes/cart.routes")
const orderRouter = require("../routes/order.routes")
const realTimeRouter = require("../routes/realTime.routes")
const riderRouter = require("../routes/rider.routes")

const cors = require("cors");


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/api/auth", authRouter);
app.use("/api/address", addressRoutes)
app.use("/api/shops", shopRouter);
app.use("/api/items", menuRouter)
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/realtime", realTimeRouter);
app.use("/api/rider", riderRouter)

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;