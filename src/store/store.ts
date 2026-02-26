import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/Auth/redux/authSlice";
import cartReducer from "../features/Cart/redux/cartSlice";
import settingsReducer from "../features/Settings/redux/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
