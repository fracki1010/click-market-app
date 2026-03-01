import { NavLink } from "react-router";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaMotorcycle,
  FaBoxesStacked,
  FaHouse,
} from "react-icons/fa6";

const adminNavItems = [
  { to: "/home", label: "Tienda", icon: <FaHouse /> },
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartLine /> },
  { to: "/admin/orders", label: "Entregas", icon: <FaMotorcycle /> },
  { to: "/admin/inventory", label: "Inventario", icon: <FaBoxesStacked /> },
];

export const AdminNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-neutral-800 flex justify-around items-center px-2 py-3 z-50 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
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
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                {item.icon}
              </motion.span>
              <span
                className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
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
