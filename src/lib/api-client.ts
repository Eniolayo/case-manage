import axios from "axios";

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL:
    "https://4n2msuk2efudngqc4xpfhw2exm0fkpmo.lambda-url.ap-south-1.on.aws",
  // baseURL: "https://api.frm.com/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, get token from localStorage or auth context
    const token = localStorage.getItem("auth_token") || "mock-jwt-token";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
