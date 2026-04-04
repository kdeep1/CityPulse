import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    timeout: 15000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});