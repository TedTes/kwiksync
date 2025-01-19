import axios from "axios";
import { vars } from "./";
export const api = axios.create({
  baseURL: `${vars.apiUrl}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Try to refresh tokens
        await api.post("/api/auth/refresh-token");
        // Retry original request
        return api(error.config);
      } catch (refreshError) {
        console.log(refreshError);
        // Redirect to login
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
