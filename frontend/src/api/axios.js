import axios from "axios";

const getToken = () => sessionStorage.getItem("token");

const clearAuth = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("email");
};

const isAuthPage = () =>
  ["/login", "/register"].includes(window.location.pathname);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 && !isAuthPage()) {
      clearAuth();
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

export default api;