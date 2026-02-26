import { FiBookOpen, FiHome, FiLogIn, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router";
import { Badge, Tooltip } from "@heroui/react";
import { FaBagShopping } from "react-icons/fa6";

import { useAuth } from "../../features/Auth/hooks/useAuth";

import { UserMenu } from "./UserMenu";

import { useCart } from "@/features/Cart/hooks/useCart";

export const Header = () => {
  const { user } = useAuth();
  const { items } = useCart();

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link
        className="flex items-center gap-2 text-white font-bold text-xl"
        to="/"
      >
        <FaBagShopping className="text-3xl" /> Click Market
        {user?.role === "ADMIN" && (
          <p className="text-sm font-normal text-amber-500 border-2 border-amber-500 px-1">
            {user.role}
          </p>
        )}
      </Link>
      <nav className="flex justify-between items-center gap-1">
        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
            to="/home"
          >
            <FiHome />
            Home
          </Link>
          <Link
            className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
            to="/products"
          >
            <FiBookOpen />
            Productos
          </Link>
          <Link
            className="flex items-center gap-1 hover:bg-white/10 rounded px-3 py-3 transition"
            to="/cart"
          >
            <Badge
              color="danger"
              content={items.length == 0 ? false : items.length}
              shape="circle"
              showOutline={false}
              size="sm"
            >
              <FiShoppingCart />
            </Badge>
          </Link>
          {!user ? (
            <Tooltip content="Iniciar sesión">
              <Link
                className="flex items-center gap-1 text-white hover:bg-white/10 rounded px-3 py-3 transition"
                to="/login"
              >
                <FiLogIn />
              </Link>
            </Tooltip>
          ) : null}
        </div>

        {/* User Menu - Always Visible */}
        {user && <UserMenu />}
      </nav>
    </header>
  );
};
