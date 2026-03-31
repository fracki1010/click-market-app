import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/Auth/redux/authSlice";

const persistedToken = localStorage.getItem("token");
const persistedRefreshToken = localStorage.getItem("refresh_token");
const persistedUser = localStorage.getItem("user");

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: persistedUser ? JSON.parse(persistedUser) : null,
      token: persistedToken,
      refreshToken: persistedRefreshToken,
      loading: false,
      error: null,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
