import { Outlet } from "react-router";
import { Footer } from "../components/layout/Footer";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background transition-colors">
        <Outlet />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};
