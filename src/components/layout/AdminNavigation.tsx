import { NavLink } from "react-router";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaMotorcycle,
  FaBoxesStacked,
  FaHouse,
  FaUsers,
  FaClipboardList,
  FaBasketShopping,
} from "react-icons/fa6";

const adminNavItems = [
  { to: "/home", label: "Tienda", icon: <FaHouse /> },
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartLine /> },
  { to: "/admin/orders", label: "Entregas", icon: <FaMotorcycle /> },
  {
    to: "/admin/shopping-list",
    label: "Compras",
    icon: <FaBasketShopping />,
  },
  { to: "/admin/movements", label: "Trazas", icon: <FaClipboardList /> },
  { to: "/admin/customers", label: "Clientes", icon: <FaUsers /> },
  { to: "/admin/inventory", label: "Inventario", icon: <FaBoxesStacked /> },
];

export const AdminNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-divider flex justify-around items-center px-2 py-3 z-50 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transition-colors">
      {adminNavItems.map((item) => (
        <NavLink
          key={item.to}
          className="relative flex flex-col items-center gap-1 group"
          to={item.to}
          end={item.to === "/home"}
        >
          {({ isActive }) => (
            <>
              <motion.span
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                }}
                className={`text-xl transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-default-400"
                }`}
              >
                {item.icon}
              </motion.span>
              <span
                className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-default-400"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--heroui-primary-opacity),0.5)]"
                  layoutId="admin-nav-dot"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
