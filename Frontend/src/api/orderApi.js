import api from "./axios";

// Fetch the authenticated customer's paid orders
export const fetchMyOrders = async () => {
  const response = await api.get("/orders/my");
  return response.data;
};

// Fetch orders for seller's shop
export const fetchShopOrders = async (shopId) => {
  try {
    const response = await api.get(`/orders/shop/${shopId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    throw error;
  }
};

// Get single order details
export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export default {
  fetchMyOrders,
  fetchShopOrders,
  fetchOrderDetails,
  updateOrderStatus,
};
