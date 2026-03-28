import { NavLink } from "react-router";
import { motion } from "framer-motion";

import type { AdminNavItem } from "../hooks/useAdminNavigationItems";

interface AdminNavLinkProps {
  item: AdminNavItem;
}

export const AdminNavLink = ({ item }: AdminNavLinkProps) => {
  return (
    <NavLink
      className="relative flex min-w-14 flex-col items-center gap-1 group focus:outline-none"
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
  );
};
