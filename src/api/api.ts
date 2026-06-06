import axios from "axios";
import type { ApiResponse, LoginResponse } from "../types";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ,
  headers: { "Content-Type": "application/json" },
});

console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);  

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh && !original.url?.includes("/auth/")) {
        original._retry = true;
        try {
          const { data } = await axios.post<ApiResponse<LoginResponse>>(
            "http://localhost:8080/api/auth/refresh",
            { refreshToken: refresh }
          );
          const tokens = data.data;
          localStorage.setItem("token", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          original.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return API(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else if (!original.url?.includes("/auth/login")) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;
