import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { Badge } from "@heroui/react";
import {
  FaHouse,
  FaBagShopping,
  FaCartShopping,
  FaUser,
} from "react-icons/fa6";

import { useCart } from "@/features/Cart/hooks/useCart";

const navItems = [
  { to: "/home", label: "Inicio", icon: <FaHouse /> },
  { to: "/products", label: "Productos", icon: <FaBagShopping /> },
  { to: "/cart", label: "Carrito", icon: <FaCartShopping />, badge: true },
  { to: "/profile", label: "Perfil", icon: <FaUser /> },
];

export const Navigation = () => {
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-neutral-800 flex justify-around items-center px-4 py-3 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          className="relative flex flex-col items-center gap-1.5 focus:outline-none"
          to={item.to}
        >
          {({ isActive }) => (
            <>
              <motion.span
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                className={`text-xl transition-all duration-300 relative ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                {item.badge && cartCount > 0 ? (
                  <Badge
                    color="danger"
                    content={cartCount}
                    shape="circle"
                    size="sm"
                    className="border-2 border-white dark:border-neutral-900"
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </motion.span>
              <span
                className={`text-[11px] font-semibold tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-neutral-500"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                  layoutId="nav-dot"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
