import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

import { RootState } from "../store/store";
import { useAuth } from "../features/Auth/hooks/useAuth";

export const MaintenanceGuard: React.FC = () => {
  const { isMaintenance } = useSelector((state: RootState) => state.settings);
  const { user } = useAuth();
  const location = useLocation();

  // Si el sitio no está en mantenimiento, dejamos pasar a todos
  if (!isMaintenance) {
    return <Outlet />;
  }

  // Si el sitio está en mantenimiento, el admin puede seguir entrando
  if (user?.role === "admin") {
    return <Outlet />;
  }

  // Si no es admin y está en mantenimiento, mandamos a la página de mantenimiento
  // Pero evitamos un loop infinito si ya está en /maintenance
  if (location.pathname === "/maintenance") {
    return <Outlet />;
  }

  return <Navigate replace to="/maintenance" />;
};
