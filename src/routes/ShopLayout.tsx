import { Outlet, useLocation } from "react-router";

import { Header } from "../components/layout/Header";
import { Navigation } from "../components/layout/Navigation";
import { Footer } from "../components/layout/Footer";

export const ShopLayout = () => {
  const location = useLocation();
  const showMobileFooter = [
    "/home",
    "/nosotros",
    "/zonas-de-entrega",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />

      <main className="flex-1 p-4 bg-background pb-20 md:pb-4 transition-colors">
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
