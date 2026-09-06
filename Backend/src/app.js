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
const paymentRouter = require("../routes/payment.routes")
const realTimeRouter = require("../routes/realTime.routes")
const riderRouter = require("../routes/rider.routes")
const locationRouter = require("../routes/location.routes")
const adminRouter = require("../routes/admin.routes")

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://galimart.up.railway.app",
  "https://galimart-production.up.railway.app", // <-- add this
  "https://galimart.co.in",
  "https://www.galimart.co.in",
  "https://galimart.vercel.app",
  "https://www.galimart.vercel.app",
];

const normalizeOrigin = (origin) => (origin || "").replace(/\/+$/, "");

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);

      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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
app.use("/api/payment", paymentRouter)
app.use("/api/realtime", realTimeRouter);
app.use("/api/rider", riderRouter)
app.use("/api/location", locationRouter)
app.use("/api/admin", adminRouter)

connectRedis().catch((error) => {
  console.error("Redis connection error:", error);
});

module.exports = app;
