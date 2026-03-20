// src/routes/ProtectedLayout.tsx
import type { RootState } from "../store/store";

import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation";
import { AdminNavigation } from "../components/layout/AdminNavigation";
import { Footer } from "../components/layout/Footer";

export const ProtectedLayout = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Show admin bottom nav on admin routes, user nav otherwise */}
      {isAdminRoute ? <AdminNavigation /> : <Navigation />}

      <main className="flex-1 p-4 bg-background pb-20 md:pb-4 transition-colors">
        <Outlet />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};
