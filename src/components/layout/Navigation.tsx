import { NavLink } from "react-router";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/products", label: "Productos" },
  { to: "/cart", label: "Cart" },
  { to: "/login", label: "Inicio de session" },
  { to: "/settings", label: "Configuraciones" },
];

export const Navigation = () => {
  return (
    <nav className="md:hidden bg-gray-800 text-white px-4 py-3 flex justify-around shadow-md">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `text-sm font-medium transition ${
              isActive ? "text-yellow-400" : "text-gray-300 hover:text-white"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
