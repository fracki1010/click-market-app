import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
// import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { Badge, Input, Button } from "@heroui/react";
import { useState } from "react";

import { useAuth } from "../../features/Auth/hooks/useAuth";
import Logo from "../../assets/Recurso 1.svg";

import { UserMenu } from "./UserMenu";

import { useCart } from "@/features/Cart/hooks/useCart";
import { warmupRouteOnIntent } from "@/routes/routeWarmup";

export const Header = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedSearch = searchValue.trim();

    if (trimmedSearch) {
      warmupRouteOnIntent("/products");
      navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);

      return;
    }

    warmupRouteOnIntent("/products");
    navigate("/products", { state: { focusSearch: true } });
  };

  return (
    <header className="pt-safe sticky top-0 z-50 w-full border-b border-divider/50 bg-background/95 shadow-sm backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/80">
      {/* Top row: Logo and Actions */}
      <div className="container mx-auto flex h-[calc(var(--app-header-height)-env(safe-area-inset-top,0px))] items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
        {/* Mobile Menu Toggle (Simplified for now) */}
        {/* <Button
          isIconOnly
          className="md:hidden text-default-600 dark:text-default-300"
          variant="light"
        >
          <FiMenu size={24} />
        </Button> */}

        {/* Logo */}
        <Link
          className="flex items-center gap-2 text-primary font-black text-xl lg:text-2xl tracking-tight shrink-0"
          to="/"
          onMouseEnter={() => warmupRouteOnIntent("/home")}
          onTouchStart={() => warmupRouteOnIntent("/home")}
        >
          {/* <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-0 m-0 rounded-xl shadow-primary-200 dark:shadow-none shadow-lg"> */}
          <img
            alt="Logo"
            className="h-8 w-auto shrink-0 object-contain sm:h-9"
            src={Logo}
          />
          {/* </div> */}
          <span className="hidden sm:inline">Click Market</span>
        </Link>

        {/* Desktop Search */}
        <form
          className="hidden md:flex flex-grow max-w-2xl relative"
          onSubmit={handleSearch}
        >
          <Input
            classNames={{
              inputWrapper:
                "bg-content1 border-divider hover:border-primary-300 focus-within:!border-primary h-11 transition-all shadow-inner",
              input: "text-sm",
            }}
            placeholder="¿Qué estás buscando hoy?"
            radius="lg"
            startContent={
              <FiSearch className="text-default-400 mr-1" size={18} />
            }
            value={searchValue}
            variant="bordered"
            onValueChange={setSearchValue}
          />
        </form>

        {/* User & Cart Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="md:hidden">
            <Button
              isIconOnly
              className="text-default-600"
              variant="light"
              onMouseEnter={() => warmupRouteOnIntent("/products")}
              onPress={() => handleSearch()}
              onTouchStart={() => warmupRouteOnIntent("/products")}
            >
              <FiSearch size={22} />
            </Button>
          </div>

          <Link
            className="hidden md:block"
            to="/cart"
            onMouseEnter={() => warmupRouteOnIntent("/cart")}
            onTouchStart={() => warmupRouteOnIntent("/cart")}
          >
            <Badge
              color="danger"
              content={items.length === 0 ? false : items.length}
              shape="circle"
              size="sm"
            >
              <Button isIconOnly className="text-default-600" variant="light">
                <FiShoppingCart size={22} />
              </Button>
            </Badge>
          </Link>

          <div className="hidden md:flex">
            {user ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                onMouseEnter={() => warmupRouteOnIntent("/login")}
                onTouchStart={() => warmupRouteOnIntent("/login")}
              >
                <Button
                  className="hidden sm:flex font-semibold"
                  color="primary"
                  radius="full"
                  size="sm"
                  variant="flat"
                >
                  Ingresar
                </Button>
                <Button
                  isIconOnly
                  className="sm:hidden text-default-600"
                  variant="light"
                >
                  <FiUser size={22} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
