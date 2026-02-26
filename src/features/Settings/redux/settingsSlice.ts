import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isMaintenance: boolean;
  storeName: string;
  storeEmail: string;
  shippingCost: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
  lowStockAlert: number;
}

const STORAGE_KEY = "click_market_settings";

const getInitialState = (): SettingsState => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing settings from localStorage", e);
    }
  }

  return {
    isMaintenance: false,
    storeName: "Click Market",
    storeEmail: "admin@clickmarket.com",
    shippingCost: 500,
    freeShippingThreshold: 5000,
    whatsappNumber: "+54 9 2622 456789",
    lowStockAlert: 5,
  };
};

const initialState: SettingsState = getInitialState();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const newState = { ...state, ...action.payload };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

      return newState;
    },
    toggleMaintenance: (state) => {
      state.isMaintenance = !state.isMaintenance;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { updateSettings, toggleMaintenance } = settingsSlice.actions;
export default settingsSlice.reducer;
