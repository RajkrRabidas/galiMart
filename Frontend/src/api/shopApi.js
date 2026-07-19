import api from "./axios";

// Create Shop
export const createShop = async (formData) => {
  const response = await api.post(
    "/shops/create-shop",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Nearby Shops
export const getNearbyShops = async (params) => {
  const response = await api.get(
    "/shops/get-nearby-shops",
    {
      params,
    }
  );

  return response.data;
};

// Single Shop
export const getShopById = async (id) => {
  const response = await api.get(
    `/shops/getAll/${id}`
  );

  return response.data;
};

// Update Shop
export const updateShop = async (
  shopId,
  formData
) => {
  const response = await api.put(
    `/shops/edit/${shopId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Open / Close Shop
export const updateShopStatus = async (
  shopId,
  status
) => {
  const response = await api.put(
    `/shops/update-shop-status/${shopId}`,
    {
      status,
    }
  );

  return response.data;
};