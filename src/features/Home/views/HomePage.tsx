import React from "react";
import { Link } from "react-router";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import {
  FaArrowRight,
  FaTruckFast,
  FaTags,
  FaBoxOpen,
  FaSnowflake,
  FaBolt,
  FaStar,
} from "react-icons/fa6";
import { motion } from "framer-motion";

interface QuickLink {
  id: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const quickLinks: QuickLink[] = [
  {
    id: 1,
    label: "Ofertas",
    icon: <FaTags />,
    color: "bg-orange-500",
    link: "/products?categories=OFERTAS",
  },
  {
    id: 2,
    label: "Almacén",
    icon: <FaBoxOpen />,
    color: "bg-blue-500",
    link: "/products?categories=ALMACÉN",
  },
  {
    id: 3,
    label: "Frescos",
    icon: <FaSnowflake />,
    color: "bg-cyan-500",
    link: "/products?categories=CARNES Y CONGELADOS",
  },
  {
    id: 4,
    label: "Express",
    icon: <FaBolt />,
    color: "bg-amber-500",
    link: "/products",
  },
  {
    id: 5,
    label: "Full",
    icon: <FaStar />,
    color: "bg-green-500",
    link: "/products",
  },
];

const banners = [
  {
    id: 1,
    title: "Liquidación Invierno",
    subtitle: "Hasta 40% OFF en seleccionados",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
    color: "from-indigo-600 to-purple-700",
  },
  {
    id: 2,
    title: "Frutas y Verduras",
    subtitle: "Frescura garantizada de la huerta",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=1200",
    color: "from-green-600 to-emerald-700",
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Banner Section - Slider-like experience */}
      <section className="px-4 mt-2">
        <div className="overflow-x-auto flex snap-x snap-mandatory no-scrollbar gap-4 pb-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[30vw] h-48 rounded-2xl relative overflow-hidden snap-center shadow-xl"
            >
              <img
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
                src={banner.image}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-60 mix-blend-multiply`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-90">
                  {banner.subtitle}
                </p>
                <h2 className="text-2xl font-black leading-tight mb-3">
                  {banner.title}
                </h2>
                <Button
                  className="w-fit font-bold"
                  radius="full"
                  size="sm"
                  variant="solid"
                >
                  Ver ahora
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Strip */}
      <section className="px-4">
        <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-6 py-2">
          {quickLinks.map((item) => (
            <Link
              key={item.id}
              className="flex flex-col items-center gap-2 shrink-0 group"
              to={item.link}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-${item.color.split("-")[1]}-200 dark:shadow-none`}
              >
                {item.icon}
              </motion.div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Delivery Info Card */}
      <section className="px-4">
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-800 border-none shadow-sm">
          <CardBody className="py-3 px-4 flex-row items-center gap-4">
            <div className="bg-white dark:bg-neutral-700 p-2.5 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400">
              <FaTruckFast size={20} />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                Envío Gratis
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                En tu primera compra superior a $15.000
              </p>
            </div>
            <Button
              isIconOnly
              className="bg-white dark:bg-neutral-700 text-gray-400 rotate-0"
              radius="full"
              size="sm"
              variant="flat"
            >
              <FaArrowRight size={12} />
            </Button>
          </CardBody>
        </Card>
      </section>

      {/* Categories Grid (More visual) */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">
            Categorías destacadas
          </h3>
          <Link
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            to="/products"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card
            isPressable
            as={Link}
            className="h-44 border-none relative overflow-hidden group shadow-md"
            to="/products?categories=ALMACÉN"
          >
            <img
              alt="Almacen"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <h4 className="text-white font-black text-lg">Almacén</h4>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                Lo básico de siempre
              </p>
            </div>
          </Card>

          <div className="grid grid-rows-2 gap-4">
            <Card
              isPressable
              as={Link}
              className="h-[88px] border-none relative overflow-hidden group shadow-md"
              to="/products?categories=CARNES Y CONGELADOS"
            >
              <img
                alt="Carnes"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1607623198457-7acd076af7ed?auto=format&fit=crop&q=80&w=400"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <h4 className="text-white font-bold text-sm leading-tight">
                  Carnicería
                </h4>
              </div>
            </Card>
            <Card
              isPressable
              as={Link}
              className="h-[88px] border-none relative overflow-hidden group shadow-md"
              to="/products?categories=OFERTAS"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600" />
              <div className="absolute inset-0 p-3 flex flex-col justify-center items-center text-center">
                <FaTags className="text-white/30 absolute -right-2 -top-2 text-5xl rotate-12" />
                <h4 className="text-white font-black text-base italic tracking-tighter uppercase underline decoration-2 underline-offset-4">
                  ¡Ofertas!
                </h4>
                <p className="text-white/90 text-[10px] font-bold mt-1">
                  Hasta 50% OFF
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Products Row */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">
            Elegidos para vos
          </h3>
          <Link
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
            to="/products"
          >
            Ver más
          </Link>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
          {/* Simple featured cards */}
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              isPressable
              className="min-w-[170px] border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-neutral-800"
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-32">
                  <img
                    alt="Producto"
                    className="w-full h-full object-cover"
                    src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&sig=${i}`}
                  />
                  <div className="absolute top-2 left-2">
                    <Chip
                      className="font-bold text-[9px] h-5"
                      color="success"
                      size="sm"
                      variant="solid"
                    >
                      FULL
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-3">
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-base">
                  $1.499
                </p>
                <h4 className="text-[12px] text-gray-700 dark:text-gray-300 font-medium line-clamp-2 mt-1 leading-tight">
                  Nombre del Producto Destacado {i}
                </h4>
                <div className="flex items-center gap-1 mt-2">
                  <FaStar className="text-amber-400" size={10} />
                  <span className="text-[10px] text-gray-400 font-bold">
                    4.8 (120)
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-4">
        <div className="bg-indigo-600 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-2xl font-black mb-2 relative z-10">
            ¿Listo para llenar el carrito?
          </h3>
          <p className="text-indigo-100 text-sm mb-6 relative z-10">
            Descubrí miles de productos seleccionados para vos con entrega en el
            día.
          </p>
          <Button
            as={Link}
            className="bg-white text-indigo-600 font-black px-8 py-6 text-base shadow-xl"
            radius="full"
            to="/products"
          >
            Empezar a comprar
          </Button>
        </div>
      </section>
    </div>
  );
};
