import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isMaintenance: boolean;
  storeName: string;
  storeEmail: string;
  shippingCost: number;
  freeShippingThreshold: number;
  minimumProducts: number;
  blockedCategoryIds: string[];
  whatsappNumber: string;
  lowStockAlert: number;
}

const STORAGE_KEY = "click_market_settings";

const DEFAULT_SETTINGS: SettingsState = {
  isMaintenance: false,
  storeName: "Click Market",
  storeEmail: "admin@clickmarket.com",
  shippingCost: 500,
  freeShippingThreshold: 5000,
  minimumProducts: 0,
  blockedCategoryIds: [],
  whatsappNumber: "+54 9 2622 456789",
  lowStockAlert: 5,
};

const getInitialState = (): SettingsState => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error("Error parsing settings from localStorage", e);
    }
  }

  return DEFAULT_SETTINGS;
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
