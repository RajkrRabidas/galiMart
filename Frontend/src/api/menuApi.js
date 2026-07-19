import api from "./axios";

// Add Item
export const addMenuItem = async (
  formData
) => {
  const response = await api.post(
    "/items/new-menu",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Get Items
export const getMenuItems = async (
  shopId
) => {
  const response = await api.get(
    `/items/all/${shopId}`
  );

  return response.data;
};

// Delete Item
export const deleteMenuItem = async (
  id
) => {
  const response = await api.delete(
    `/items/${id}`
  );

  return response.data;
};

// Toggle Item
export const toggleMenuStatus = async (
  id
) => {
  const response = await api.delete(
    `/items/status/${id}`
  );

  return response.data;
};