import axios from "axios";
import { clearAuth } from "../utils/auth";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// =====================================
// REQUEST
// =====================================
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// =====================================
// RESPONSE
// =====================================
API.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status;
    const message =
      error.response?.data?.message;

    console.log(
      "API ERROR:",
      status,
      message
    );

    // =====================================
    // HANYA LOGOUT JIKA TOKEN INVALID
    // =====================================
    if (
      status === 401 ||
      message === "Token tidak valid" ||
      message === "Token expired"
    ) {

      clearAuth();

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;