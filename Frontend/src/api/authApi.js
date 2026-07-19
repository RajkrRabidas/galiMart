import api from "./axios";

// Register
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Verify Registration OTP
export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-register-otp", data);
  return response.data;
};

// Login
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Verify Login OTP
export const verifyLoginOtp = async (data) => {
  const response = await api.post(
    "/auth/verify-login-otp",
    data
  );

  return response.data;
};