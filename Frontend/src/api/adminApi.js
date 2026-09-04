import api from "./axios";

export const getAdminOverview = async () => (await api.get("/admin/overview")).data;
export const getAdminUsers = async (search = "") => (await api.get("/admin/users", { params: { search } })).data;
export const updateAdminUserStatus = async (id, blocked, reason = "") => (await api.patch(`/admin/users/${id}/status`, { blocked, reason })).data;
export const getAdminOrders = async (params = {}) => (await api.get("/admin/orders", { params })).data;
export const getAdminComplaints = async (status = "") => (await api.get("/admin/complaints", { params: { status } })).data;
export const updateAdminComplaint = async (id, payload) => (await api.patch(`/admin/complaints/${id}`, payload)).data;
export const getAdminActivityLogs = async () => (await api.get("/admin/activity-logs")).data;

export const getPendingShops = async () => {
  const response = await api.get("/admin/pending-shops");
  return response.data;
};

export const getVerifiedShops = async () => {
  const response = await api.get("/admin/verified-shops");
  return response.data;
};

export const verifyShop = async (shopId, reason = "") => {
  const response = await api.post(`/admin/verify-shop/${shopId}`, { reason });
  return response.data;
};

export const rejectShop = async (shopId, reason) => (await api.post(`/admin/reject-shop/${shopId}`, { reason })).data;
export const suspendShop = async (shopId, suspended, reason = "") => (await api.patch(`/admin/shops/${shopId}/suspension`, { suspended, reason })).data;

export const unverifyShop = async (shopId) => {
  const response = await api.post(`/admin/unverify-shop/${shopId}`);
  return response.data;
};

export const getShopDetails = async (shopId) => {
  const response = await api.get(`/admin/shops/${shopId}`);
  return response.data?.shop;
};

export const getPendingRiders = async () => {
  const response = await api.get("/admin/pending-riders");
  return response.data;
};

export const getVerifiedRiders = async () => {
  const response = await api.get("/admin/verified-riders");
  return response.data;
};

export const verifyRider = async (riderId, reason = "") => {
  const response = await api.post(`/admin/verify-rider/${riderId}`, { reason });
  return response.data;
};

export const rejectRider = async (riderId, reason) => (await api.post(`/admin/reject-rider/${riderId}`, { reason })).data;
export const suspendRider = async (riderId, suspended, reason = "") => (await api.patch(`/admin/riders/${riderId}/suspension`, { suspended, reason })).data;

export const unverifyRider = async (riderId) => {
  const response = await api.post(`/admin/unverify-rider/${riderId}`);
  return response.data;
};

export const getRiderDetails = async (riderId) => {
  const response = await api.get(`/admin/riders/${riderId}`);
  return response.data?.rider;
};
