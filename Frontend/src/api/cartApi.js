import api from "./axios";

// Add To Cart
export const addToCart = async (
  data
) => {
  const response = await api.post(
    "/api/cart/add-to-card",
    data
  );

  return response.data;
};

// Fetch Cart
export const fetchCart = async () => {
  const response = await api.post(
    "/api/cart/all-cart"
  );

  return response.data;
};

// Increase Quantity
export const incrementCart = async (
  data
) => {
  const response = await api.put(
    "/api/cart/inc",
    data
  );

  return response.data;
};

// Decrease Quantity
export const decrementCart = async (
  data
) => {
  const response = await api.put(
    "/api/cart/dec",
    data
  );

  return response.data;
};

// Clear Cart
export const clearCart = async () => {
  const response = await api.delete(
    "/api/cart/clear-cart"
  );

  return response.data;
};