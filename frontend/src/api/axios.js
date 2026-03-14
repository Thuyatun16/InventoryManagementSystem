import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["user-id"] = userId;
  }
  if (isAdmin) {
    config.headers["is-admin"] = isAdmin;
  }

  return config;
});

export default api;
