// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { ProductsPage } from "../features/Products/views/ProductsPage";
import { ProductDetailPage } from "../features/Products/views/ProductDetailPage";
import { CartPage } from "../features/Cart/views/CartPage";
import { LoginPage } from "../features/Auth/views/LoginPage";
import { RegisterPage } from "../features/Auth/views/RegisterPage";
import { Setting } from "../features/Settings/views/Settings";
import { HomePage } from "../features/Home/views/HomePage";
import { CheckoutPage } from "../features/Order/view/CheckoutPage";
import { OrderSuccessPage } from "../features/Order/view/OrderSuccessPage";
import { MaintenancePage } from "../features/Settings/views/MaintenancePage";

import { ProtectedLayout } from "./ProtectedLayout";
import { ShopLayout } from "./ShopLayout";
import { AuthLayout } from "./AuthLayout";
import { AdminGuard } from "./AdminGuard";
import { MaintenanceGuard } from "./MaintenanceGuard";

import { OrderPage } from "@/features/Order/view/OrderPage";
import { OrderDetailPage } from "@/features/Order/view/OrderDetailPage";
import { AdminDashboard } from "@/features/Admin/views/AdminDashboard";
import { InventoryPage } from "@/features/Admin/views/InventoryPage";
import { ProfilePage } from "@/features/Auth/views/ProfilePage";
import { AdminOrdersPage } from "@/features/Admin/views/AdminOrdersPage";
import { AdminOrderDetailPage } from "@/features/Admin/views/AdminOrderDetailPage";
import { AdminProductDetailPage } from "@/features/Admin/views/AdminProductDetailPage";
import { DeliveryZonesPage } from "@/features/Home/views/DeliveryZonePage";
import { AboutPage } from "@/features/Home/views/AboutPage";
import { PrivacyPage } from "@/features/Home/views/PrivacyPage";
import { TermsPage } from "@/features/Home/views/TermsPage";
import { ConditionsPage } from "@/features/Home/views/ConditionsPage";
import { AdminCustomersPage } from "@/features/Admin/views/AdminCustomersPage";
import { AdminMovementsPage } from "@/features/Admin/views/AdminMovementsPage";
import { AdminShoppingListPage } from "@/features/Admin/views/AdminShoppingListPage";
import { ScrollToTop } from "../components/layout/ScrollToTop";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
            <Route element={<OrderSuccessPage />} path="/checkout/success/:id" />
            <Route element={<OrderPage />} path="/my-orders" />
            <Route element={<OrderDetailPage />} path="/my-orders/:id" />

            {/* RUTAS SOLO ADMIN  */}
            <Route element={<AdminGuard />}>
              <Route element={<AdminDashboard />} path="/admin/dashboard" />
              <Route element={<InventoryPage />} path="/admin/inventory" />
              <Route element={<AdminOrdersPage />} path="/admin/orders" />
              <Route
                element={<AdminShoppingListPage />}
                path="/admin/shopping-list"
              />
              <Route element={<AdminCustomersPage />} path="/admin/customers" />
              <Route element={<AdminMovementsPage />} path="/admin/movements" />
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
    </BrowserRouter>
  );
};
