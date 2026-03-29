import { Outlet, useLocation } from "react-router";

import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";

export const ShopLayout = () => {
  const location = useLocation();
  const shouldHideMobileNavigation =
    location.pathname === "/cart" || location.pathname.startsWith("/products/");
  const shouldReserveBottomNavSpace = !shouldHideMobileNavigation;
  const showMobileFooter = ["/home", "/nosotros", "/zonas-de-entrega"].includes(
    location.pathname,
  );

  return (
    <div className="flex min-h-screen-safe flex-col">
      <Header />
      {!shouldHideMobileNavigation && <Navigation />}

      <main
        className={`flex-1 bg-background px-0 py-3 transition-colors md:p-4 md:pb-4 ${
          shouldReserveBottomNavSpace ? "pb-app-nav" : "pb-4"
        }`}
      >
        <Outlet />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      {showMobileFooter && (
        <div className="md:hidden">
          <Footer />
        </div>
      )}
    </div>
  );
};
