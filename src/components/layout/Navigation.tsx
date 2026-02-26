import { NavLink } from "react-router";
import {
  FaHouse,
  FaBagShopping,
  FaCartShopping,
  FaUser,
} from "react-icons/fa6";

const navItems = [
  { to: "/home", label: "Inicio", icon: <FaHouse /> },
  { to: "/products", label: "Productos", icon: <FaBagShopping /> },
  { to: "/cart", label: "Carrito", icon: <FaCartShopping /> },
  { to: "/profile", label: "Perfil", icon: <FaUser /> },
  // { to: "/settings", label: "Config", icon: <FaGear /> },
];

export const Navigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex justify-between px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors duration-200 ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
            }`
          }
          to={item.to}
        >
          {({ isActive }) => (
            <>
              <span className={`text-xl ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
