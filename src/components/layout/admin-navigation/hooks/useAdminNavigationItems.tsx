import { useMemo, type ReactNode } from "react";
import { useLocation } from "react-router";
import {
  FaChartLine,
  FaMotorcycle,
  FaBoxesStacked,
  FaHouse,
  FaUsers,
  FaClipboardList,
  FaBasketShopping,
} from "react-icons/fa6";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const primaryNavItems: AdminNavItem[] = [
  { to: "/home", label: "Tienda", icon: <FaHouse /> },
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartLine /> },
  { to: "/admin/orders", label: "Entregas", icon: <FaMotorcycle /> },
];

const secondaryNavItems: AdminNavItem[] = [
  {
    to: "/admin/shopping-list",
    label: "Compras",
    icon: <FaBasketShopping />,
  },
  { to: "/admin/movements", label: "Trazas", icon: <FaClipboardList /> },
  { to: "/admin/customers", label: "Clientes", icon: <FaUsers /> },
  { to: "/admin/inventory", label: "Inventario", icon: <FaBoxesStacked /> },
];

export const useAdminNavigationItems = () => {
  const location = useLocation();

  const isSecondaryActive = useMemo(
    () => secondaryNavItems.some((item) => location.pathname.startsWith(item.to)),
    [location.pathname],
  );

  return {
    primaryNavItems,
    secondaryNavItems,
    isSecondaryActive,
  };
};
