import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  name?: string;
  role: string;
  email: string;
  phone?: string;
  authProvider?: "local" | "google";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const tokenFromStorage = localStorage.getItem("token");
const refreshTokenFromStorage = localStorage.getItem("refresh_token");
const userFromStorage = localStorage.getItem("user");

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage,
  refreshToken: refreshTokenFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>,
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      // Guardar en localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refresh_token", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setSessionTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refresh_token", action.payload.refreshToken);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },

    updateUser: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    setErrorRegister: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload || "No se pudo registrar el usuario";
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setSessionTokens,
  logout,
  setErrorRegister,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
