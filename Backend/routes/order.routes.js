const express = require("express");
const { isAuth, isSeller } = require("../middlewares/auth.middleware");
const {
  createOrder,
  fetchOrderForPayment,
  fetchShopOrders,
  updateOrderStatus,
  getMyOrders,
  fetchSingleOrder,
  assignRiderToOrder,
  getCurrentOrdersForRider,
  updateOrderStatusRider,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/create", isAuth, createOrder);
router.get("/payment/:id", isAuth, fetchOrderForPayment);
router.get("/:shopId", isAuth, isSeller, fetchShopOrders);
router.put("/:orderId", isAuth, isSeller, updateOrderStatus);
router.get("/my", isAuth, getMyOrders);
router.get("/:id", isAuth, fetchSingleOrder);
router.put("/assign/rider", isAuth, assignRiderToOrder);
router.get("/current/rider", isAuth, getCurrentOrdersForRider);
router.put("/update/status/rider", isAuth, updateOrderStatusRider);


module.exports = router;
