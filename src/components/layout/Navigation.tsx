import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { Badge } from "@heroui/react";
import {
  FaHouse,
  FaBagShopping,
  FaTableCells,
  FaCartShopping,
  FaUser,
} from "react-icons/fa6";

import { useCart } from "@/features/Cart/hooks/useCart";
import { warmupRouteOnIntent } from "@/routes/routeWarmup";

const navItems = [
  { to: "/home", label: "Inicio", icon: <FaHouse /> },
  { to: "/categories", label: "Categorías", icon: <FaTableCells /> },
  { to: "/products", label: "Productos", icon: <FaBagShopping /> },
  { to: "/cart", label: "Carrito", icon: <FaCartShopping />, badge: true },
  { to: "/profile", label: "Perfil", icon: <FaUser /> },
];

export const Navigation = () => {
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px))] items-center justify-around border-t border-divider bg-background/90 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-colors md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          className="relative flex min-w-0 flex-1 flex-col items-center gap-1 focus:outline-none"
          to={item.to}
          onMouseEnter={() => warmupRouteOnIntent(item.to)}
          onTouchStart={() => warmupRouteOnIntent(item.to)}
        >
          {({ isActive }) => (
            <>
              <motion.span
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                className={`text-xl transition-all duration-300 relative ${
                  isActive ? "text-primary" : "text-default-400"
                }`}
              >
                {item.badge && cartCount > 0 ? (
                  <Badge
                    className="border-2 border-background"
                    color="danger"
                    content={cartCount}
                    shape="circle"
                    size="sm"
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </motion.span>
              <span
                className={`text-[11px] font-semibold tracking-wide transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-default-400"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--heroui-primary-opacity),0.5)]"
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
