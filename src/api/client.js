import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
});

// Private client with interceptor
export const privateApiClient = axios.create({
  baseURL: `${baseURL}/api`,
});

// Attach token dynamically before each request
privateApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
privateApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login or clear token)
      localStorage.removeItem("token");
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);
