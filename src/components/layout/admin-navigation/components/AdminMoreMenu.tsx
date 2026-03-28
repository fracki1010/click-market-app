import { useState } from "react";
import { Link } from "react-router";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import { FaEllipsis } from "react-icons/fa6";

import type { AdminNavItem } from "../hooks/useAdminNavigationItems";

interface AdminMoreMenuProps {
  items: AdminNavItem[];
  isActive: boolean;
}

export const AdminMoreMenu = ({ items, isActive }: AdminMoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="top"
      showArrow
    >
      <PopoverTrigger>
        <button className="relative flex min-w-14 flex-col items-center gap-1 group focus:outline-none">
          <motion.span
            animate={{
              scale: isActive ? 1.2 : 1,
              y: isActive ? -4 : 0,
            }}
            className={`text-xl transition-colors duration-300 ${
              isActive ? "text-primary" : "text-default-400"
            }`}
          >
            <FaEllipsis />
          </motion.span>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
              isActive ? "text-primary" : "text-default-400"
            }`}
          >
            Más
          </span>
          {isActive && (
            <motion.div
              className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--heroui-primary-opacity),0.5)]"
              layoutId="admin-nav-dot"
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-60 border border-divider">
        <div className="w-full rounded-xl bg-content1">
          <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-default-500">
            Más accesos
          </div>
          <Divider />
          <div className="p-2 grid grid-cols-1 gap-1">
            {items.map((item) => (
              <Button
                key={item.to}
                as={Link}
                className="justify-start font-semibold"
                color="default"
                onPress={() => setIsOpen(false)}
                to={item.to}
                variant="light"
              >
                <span className="mr-2 text-base">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
