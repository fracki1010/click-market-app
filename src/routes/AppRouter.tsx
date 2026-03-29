// src/routes/AppRouter.tsx
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

import { ScrollToTop } from "../components/layout/ScrollToTop";
import { LoadingComponent } from "../components/layout/LoadingComponent";

import { ProtectedLayout } from "./ProtectedLayout";
import { ShopLayout } from "./ShopLayout";
import { AuthLayout } from "./AuthLayout";
import { AdminGuard } from "./AdminGuard";
import { MaintenanceGuard } from "./MaintenanceGuard";

import {
  canRunIdlePreload,
  getLikelyPreloadLimit,
} from "@/utils/networkPrefetch";

const loadHomePage = () => import("../features/Home/views/HomePage");
const loadProductsPage = () =>
  import("../features/Products/views/ProductsPage");
const loadProductDetailPage = () =>
  import("../features/Products/views/ProductDetailPage");
const loadCategoriesPage = () =>
  import("../features/Categories/views/CategoriesPage");
const loadCartPage = () => import("../features/Cart/views/CartPage");
const loadLoginPage = () => import("../features/Auth/views/LoginPage");
const loadRegisterPage = () => import("../features/Auth/views/RegisterPage");
const loadProfilePage = () => import("../features/Auth/views/ProfilePage");
const loadSettingPage = () => import("../features/Settings/views/Settings");
const loadMaintenancePage = () =>
  import("../features/Settings/views/MaintenancePage");
const loadCheckoutPage = () => import("../features/Order/view/CheckoutPage");
const loadOrderSuccessPage = () =>
  import("../features/Order/view/OrderSuccessPage");
const loadOrderPage = () => import("../features/Order/view/OrderPage");
const loadOrderDetailPage = () =>
  import("../features/Order/view/OrderDetailPage");
const loadDeliveryZonesPage = () =>
  import("../features/Home/views/DeliveryZonePage");
const loadAboutPage = () => import("../features/Home/views/AboutPage");
const loadPrivacyPage = () => import("../features/Home/views/PrivacyPage");
const loadTermsPage = () => import("../features/Home/views/TermsPage");
const loadConditionsPage = () =>
  import("../features/Home/views/ConditionsPage");
const loadAdminDashboardPage = () =>
  import("../features/Admin/views/AdminDashboard");
const loadInventoryPage = () => import("../features/Admin/views/InventoryPage");
const loadAdminOrdersPage = () =>
  import("../features/Admin/views/AdminOrdersPage");
const loadAdminOrderDetailPage = () =>
  import("../features/Admin/views/AdminOrderDetailPage");
const loadAdminProductDetailPage = () =>
  import("../features/Admin/views/AdminProductDetailPage");
const loadAdminCustomersPage = () =>
  import("../features/Admin/views/AdminCustomersPage");
const loadAdminCustomerDetailPage = () =>
  import("../features/Admin/views/AdminCustomerDetailPage");
const loadAdminMovementsPage = () =>
  import("../features/Admin/views/AdminMovementsPage");
const loadAdminShoppingListPage = () =>
  import("../features/Admin/views/AdminShoppingListPage");

const HomePage = lazy(() =>
  loadHomePage().then((module) => ({
    default: module.HomePage,
  })),
);
const ProductsPage = lazy(() =>
  loadProductsPage().then((module) => ({
    default: module.ProductsPage,
  })),
);
const ProductDetailPage = lazy(() =>
  loadProductDetailPage().then((module) => ({
    default: module.ProductDetailPage,
  })),
);
const CategoriesPage = lazy(() =>
  loadCategoriesPage().then((module) => ({
    default: module.CategoriesPage,
  })),
);
const CartPage = lazy(() =>
  loadCartPage().then((module) => ({
    default: module.CartPage,
  })),
);
const LoginPage = lazy(() =>
  loadLoginPage().then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  loadRegisterPage().then((module) => ({
    default: module.RegisterPage,
  })),
);
const ProfilePage = lazy(() =>
  loadProfilePage().then((module) => ({
    default: module.ProfilePage,
  })),
);
const Setting = lazy(() =>
  loadSettingPage().then((module) => ({
    default: module.Setting,
  })),
);
const MaintenancePage = lazy(() =>
  loadMaintenancePage().then((module) => ({
    default: module.MaintenancePage,
  })),
);
const CheckoutPage = lazy(() =>
  loadCheckoutPage().then((module) => ({
    default: module.CheckoutPage,
  })),
);
const OrderSuccessPage = lazy(() =>
  loadOrderSuccessPage().then((module) => ({
    default: module.OrderSuccessPage,
  })),
);
const OrderPage = lazy(() =>
  loadOrderPage().then((module) => ({
    default: module.OrderPage,
  })),
);
const OrderDetailPage = lazy(() =>
  loadOrderDetailPage().then((module) => ({
    default: module.OrderDetailPage,
  })),
);
const DeliveryZonesPage = lazy(() =>
  loadDeliveryZonesPage().then((module) => ({
    default: module.DeliveryZonesPage,
  })),
);
const AboutPage = lazy(() =>
  loadAboutPage().then((module) => ({
    default: module.AboutPage,
  })),
);
const PrivacyPage = lazy(() =>
  loadPrivacyPage().then((module) => ({
    default: module.PrivacyPage,
  })),
);
const TermsPage = lazy(() =>
  loadTermsPage().then((module) => ({
    default: module.TermsPage,
  })),
);
const ConditionsPage = lazy(() =>
  loadConditionsPage().then((module) => ({
    default: module.ConditionsPage,
  })),
);
const AdminDashboard = lazy(() =>
  loadAdminDashboardPage().then((module) => ({
    default: module.AdminDashboard,
  })),
);
const InventoryPage = lazy(() =>
  loadInventoryPage().then((module) => ({
    default: module.InventoryPage,
  })),
);
const AdminOrdersPage = lazy(() =>
  loadAdminOrdersPage().then((module) => ({
    default: module.AdminOrdersPage,
  })),
);
const AdminOrderDetailPage = lazy(() =>
  loadAdminOrderDetailPage().then((module) => ({
    default: module.AdminOrderDetailPage,
  })),
);
const AdminProductDetailPage = lazy(() =>
  loadAdminProductDetailPage().then((module) => ({
    default: module.AdminProductDetailPage,
  })),
);
const AdminCustomersPage = lazy(() =>
  loadAdminCustomersPage().then((module) => ({
    default: module.AdminCustomersPage,
  })),
);
const AdminCustomerDetailPage = lazy(() =>
  loadAdminCustomerDetailPage().then((module) => ({
    default: module.AdminCustomerDetailPage,
  })),
);
const AdminMovementsPage = lazy(() =>
  loadAdminMovementsPage().then((module) => ({
    default: module.AdminMovementsPage,
  })),
);
const AdminShoppingListPage = lazy(() =>
  loadAdminShoppingListPage().then((module) => ({
    default: module.AdminShoppingListPage,
  })),
);

type PreloadJob = {
  key: string;
  loader: () => Promise<unknown>;
};

const preloadedModules = new Set<string>();

const preloadModuleOnce = ({ key, loader }: PreloadJob) => {
  if (preloadedModules.has(key)) return;
  preloadedModules.add(key);
  void loader().catch(() => {
    preloadedModules.delete(key);
  });
};

const scheduleIdle = (task: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  if ("requestIdleCallback" in window) {
    const idleId = (window as any).requestIdleCallback(task, { timeout: 1200 });

    return () => {
      if ("cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
    };
  }

  const timeoutId = setTimeout(task, 250);

  return () => clearTimeout(timeoutId);
};

const RoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    if (!canRunIdlePreload()) return;

    const jobs: PreloadJob[] = [];

    if (location.pathname === "/" || location.pathname.startsWith("/home")) {
      jobs.push(
        { key: "products", loader: loadProductsPage },
        { key: "categories", loader: loadCategoriesPage },
        { key: "cart", loader: loadCartPage },
      );
    } else if (location.pathname.startsWith("/products")) {
      jobs.push(
        { key: "home", loader: loadHomePage },
        { key: "cart", loader: loadCartPage },
      );
    } else if (location.pathname.startsWith("/categories")) {
      jobs.push(
        { key: "products", loader: loadProductsPage },
        { key: "home", loader: loadHomePage },
      );
    } else if (location.pathname.startsWith("/cart")) {
      jobs.push(
        { key: "products", loader: loadProductsPage },
        { key: "checkout", loader: loadCheckoutPage },
      );
    } else if (location.pathname.startsWith("/checkout")) {
      jobs.push(
        { key: "order-success", loader: loadOrderSuccessPage },
        { key: "orders", loader: loadOrderPage },
      );
    } else if (location.pathname.startsWith("/login")) {
      jobs.push(
        { key: "register", loader: loadRegisterPage },
        { key: "home", loader: loadHomePage },
      );
    }

    if (!jobs.length) return;
    const likelyLimit = getLikelyPreloadLimit();

    return scheduleIdle(() => {
      jobs.slice(0, likelyLimit).forEach(preloadModuleOnce);
    });
  }, [location.pathname]);

  return null;
};

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <RoutePreloader />
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          {/* RUTA DE MANTENIMIENTO (Accesible siempre para que el guard pueda redirigir) */}
          <Route element={<MaintenancePage />} path="/maintenance" />

          {/* GUARD DE MANTENIMIENTO: Envuelve todo el resto de la app */}
          <Route element={<MaintenanceGuard />}>
            {/* 1. RUTAS DE AUTENTICACIÓN (Públicas restringidas) */}
            <Route element={<AuthLayout />}>
              <Route element={<LoginPage />} path="/login" />
              <Route element={<RegisterPage />} path="/register" />
            </Route>

            {/* 2. RUTAS DE LA TIENDA (Públicas abiertas - Visitantes y Clientes) */}
            <Route element={<ShopLayout />}>
              <Route element={<Navigate replace to="/home" />} path="/" />
              <Route element={<HomePage />} path="/home" />
              <Route element={<CategoriesPage />} path="/categories" />
              <Route element={<ProductsPage />} path="/products" />
              <Route element={<ProductDetailPage />} path="/products/:id" />
              <Route element={<CartPage />} path="/cart" />
              <Route element={<DeliveryZonesPage />} path="/zonas-de-entrega" />
              <Route element={<AboutPage />} path="/nosotros" />
              <Route element={<PrivacyPage />} path="/privacidad" />
              <Route element={<TermsPage />} path="/terminos" />
              <Route element={<ConditionsPage />} path="/condiciones" />
            </Route>

            {/* 3. RUTAS PROTEGIDAS (Solo Clientes Autenticados) */}
            <Route element={<ProtectedLayout />}>
              <Route element={<ProfilePage />} path="/profile" />
              <Route element={<Setting />} path="/settings" />
              <Route element={<CheckoutPage />} path="/checkout" />
              <Route
                element={<OrderSuccessPage />}
                path="/checkout/success/:id"
              />
              <Route element={<OrderPage />} path="/my-orders" />
              <Route element={<OrderDetailPage />} path="/my-orders/:id" />

              <Route element={<AdminGuard />}>
                <Route element={<AdminDashboard />} path="/admin/dashboard" />
                <Route element={<InventoryPage />} path="/admin/inventory" />
                <Route element={<AdminOrdersPage />} path="/admin/orders" />
                <Route
                  element={<AdminShoppingListPage />}
                  path="/admin/shopping-list"
                />
                <Route
                  element={<AdminCustomersPage />}
                  path="/admin/customers"
                />
                <Route
                  element={<AdminCustomerDetailPage />}
                  path="/admin/customers/:customerId"
                />
                <Route
                  element={<AdminMovementsPage />}
                  path="/admin/movements"
                />
                <Route
                  element={<AdminOrderDetailPage />}
                  path="/admin/orders/:id"
                />
                <Route
                  element={<AdminProductDetailPage />}
                  path="/admin/inventory/:id"
                />
              </Route>
            </Route>
          </Route>

          {/* Catch-all */}
          <Route element={<Navigate replace to="/home" />} path="/*" />
        </Routes>
      </Suspense>
    </>
  );
};
