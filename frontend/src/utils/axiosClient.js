import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Automatically attach Bearer token for cross-origin authentication
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("cf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
