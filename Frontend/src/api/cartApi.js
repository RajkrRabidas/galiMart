import api from "./axios";

// Add To Cart
export const addToCart = async (shopId, itemId) => {
  const response = await api.post(
    "/cart/add-to-card",
    { shopId, itemId }
  );

  return response.data;
};

// Fetch Cart
export const fetchCart = async () => {
  const response = await api.post(
    "/cart/all-cart"
  );

  return response.data;
};

// Increase Quantity
export const incrementCart = async (itemId) => {
  const response = await api.put(
    "/cart/inc",
    { itemId }
  );

  return response.data;
};

// Decrease Quantity
export const decrementCart = async (itemId) => {
  const response = await api.put(
    "/cart/dec",
    { itemId }
  );

  return response.data;
};

// Clear Cart
export const clearCart = async () => {
  const response = await api.delete(
    "/cart/clear-cart"
  );

  return response.data;
};