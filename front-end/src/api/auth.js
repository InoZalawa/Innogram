import apiClient from "./client";

// Auth microservice endpoints — fill in when backend contract is final.
const AuthApi = {
  signup: async (payload) => {
    // TODO: implement POST /signup
    // return apiClient.post("/signup", payload);
    throw new Error("AuthApi.signup is not implemented yet");
  },
  login: async (payload) => {
    // TODO: implement POST /login
    // return apiClient.post("/login", payload);
    throw new Error("AuthApi.login is not implemented yet");
  },
  logout: async () => {
    // TODO: implement POST /logout (likely clears server-side session/cookie)
    // return apiClient.post("/logout");
    throw new Error("AuthApi.logout is not implemented yet");
  },
  refresh: async () => {
    // TODO: implement POST /refresh or GET /refresh-token depending on backend
    // return apiClient.post("/refresh");
    throw new Error("AuthApi.refresh is not implemented yet");
  },
};

export default AuthApi;
export { apiClient };
