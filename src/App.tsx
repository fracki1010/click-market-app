// src/App.tsx
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";

import { store } from "./store/store";
import { queryClient } from "./lib/queryClient";
import { AppRouter } from "./routes/AppRouter";
import "./index.css";

export const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </Provider>
  );
};
