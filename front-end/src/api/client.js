import axios from "axios";

// Central axios instance; point baseURL to auth service (e.g. env value).
const apiClient = axios.create({
  // TODO: set to your auth microservice base URL, e.g. process.env.REACT_APP_AUTH_API
  baseURL: "",
  withCredentials: true,
});

// TODO: add auth token injection when backend contract is ready.
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default apiClient;
