import api from "./axios";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-register-otp", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const verifyLoginOtp = async (data) => {
  const response = await api.post("/auth/verify-login-otp", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const completeProfile = async (data) => {
  const response = await api.patch("/auth/complete-profile", data);
  return response.data;
};