import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, ""),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Keep refresh requests outside the main interceptors to avoid refresh loops.
const refreshApi = axios.create({
  baseURL: api.defaults.baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let isLoggingOut = false;
let pendingQueue = [];

export const setLoggingOut = (value) => {
  isLoggingOut = value;
};

const processQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipRefresh = ["/auth/refresh-token", "/auth/logout"].some((path) =>
      originalRequest?.url?.includes(path)
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !skipRefresh &&
      !isLoggingOut &&
      localStorage.getItem("auth_user")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // wait for the in-flight refresh to finish, then retry
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await refreshApi.post("/auth/refresh-token");
        const accessToken = refreshResponse.data?.tokens?.accessToken;
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          localStorage.removeItem("access_token");
        }
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        window.dispatchEvent(new Event("auth:session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;