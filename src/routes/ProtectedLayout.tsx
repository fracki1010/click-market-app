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
  const shouldHideUserNavigation =
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/checkout/");
  const shouldShowNavigation = isAdminRoute || !shouldHideUserNavigation;
  const shouldReserveBottomNavSpace = shouldShowNavigation;

  return (
    <div className="flex min-h-screen-safe flex-col">
      <Header />
      {/* Show admin bottom nav on admin routes, user nav otherwise */}
      {shouldShowNavigation &&
        (isAdminRoute ? <AdminNavigation /> : <Navigation />)}

      <main
        className={`flex-1 bg-background p-4 transition-colors md:pb-4 ${
          shouldReserveBottomNavSpace ? "pb-app-nav" : "pb-4"
        }`}
      >
        <Outlet />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};
