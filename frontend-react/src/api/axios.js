import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Export individual API functions
export const signup = (userData) => api.post("/auth/signup", userData);
export const login = (userData) => api.post("/auth/login", userData);
export const testConnection = () => axios.get("http://localhost:5000/api/test");
export const healthCheck = () => axios.get("http://localhost:5000/api/health");
export const getAllFood = () => api.get("/food");

export default api;
