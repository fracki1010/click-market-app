import axios from "axios";

import { store } from "../store/store";
import { logout, setSessionTokens } from "../features/Auth/redux/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login?session_expired=true";
  }
};

const clearSessionAndRedirect = () => {
  store.dispatch(logout());
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  redirectToLogin();
};

const refreshSession = async (): Promise<string> => {
  const refreshToken =
    store.getState().auth.refreshToken || localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No hay refresh token para renovar sesión");
  }

  const response = await apiClient.post("/auth/refresh", {
    refresh_token: refreshToken,
  });

  const newAccessToken = String(response?.data?.access_token || "").trim();
  const newRefreshToken = String(response?.data?.refresh_token || "").trim();

  if (!newAccessToken || !newRefreshToken) {
    throw new Error("La renovación de sesión no devolvió tokens válidos");
  }

  store.dispatch(
    setSessionTokens({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    }),
  );

  return newAccessToken;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = (error?.config || {}) as any;
    const hadActiveSession = Boolean(
      store.getState().auth.token ||
        localStorage.getItem("token") ||
        store.getState().auth.refreshToken ||
        localStorage.getItem("refresh_token"),
    );

    const isUnauthorized = error?.response?.status === 401;
    const requestUrl = String(originalRequest?.url || "");
    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    const isRetry = Boolean(originalRequest?._retry);

    if (isUnauthorized && hadActiveSession && !isRefreshRequest && !isRetry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshSession().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (_refreshError) {
        clearSessionAndRedirect();
      }
    }

    if (isUnauthorized && hadActiveSession) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  },
);
