import React from "react";
import { Link } from "react-router"; // Asegurate de usar react-router-dom
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  CardHeader,
  Chip,
} from "@heroui/react";
import {
  FaArrowRight,
  FaBasketShopping,
  FaTruckFast,
  FaHouseChimney,
  FaTags,
  FaBoxOpen,
  FaSnowflake,
} from "react-icons/fa6";

interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
  tag: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Ofertas Especiales",
    description:
      "Aprovechá los mejores descuentos y promociones en productos seleccionados.",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    link: "/products?categories=OFERTAS&sort=featured&page=1",
    linkText: "Ver Ofertas",
    icon: <FaTags />,
    tag: "Destacado",
  },
  {
    id: 2,
    title: "Almacén",
    description:
      "Todo lo que necesitas para tu despensa diaria, siempre al mejor precio.",
    image: "https://images.pexels.com/photos/1367243/pexels-photo-1367243.jpeg",
    link: "/products?categories=ALMACÉN&sort=featured&page=1",
    linkText: "Ir a Almacén",
    icon: <FaBoxOpen />,
    tag: "Esenciales",
  },
  {
    id: 3,
    title: "Carnes y Congelados",
    description:
      "Cortes de primera calidad y productos listos para guardar en tu freezer.",
    image:
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg",
    link: "/products?categories=CARNES Y CONGELADOS&sort=featured&page=1",
    linkText: "Ver Carnes",
    icon: <FaSnowflake />,
    tag: "Frescos",
  },
];

export const HomePage: React.FC = () => {
  return (
    <main className="flex-grow bg-slate-50 dark:bg-zinc-950 transition-colors min-h-screen">
      {/* Hero Section - Uso de colores PRIMARY y SECONDARY */}
      <section className="relative w-full bg-gradient-to-br from-primary to-primary-700 dark:from-primary-900 dark:to-primary-950 text-white py-24 px-4 overflow-hidden">
        {/* Elementos decorativos abstractos adaptados al theme */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Chip
            className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-md"
            startContent={<FaHouseChimney className="mx-1" />}
            variant="flat"
          >
            Exclusivo para tu zona
          </Chip>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-appearance-in">
            El súper en tu puerta, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-white">
              así de simple.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            <strong>Click Market</strong> llega a tu barrio para que no pierdas
            tiempo en filas. Calidad premium y entrega personalizada en tu
            hogar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              className="font-bold shadow-xl hover:scale-105 transition-transform"
              color="secondary"
              endContent={<FaBasketShopping />}
              size="lg"
              to="/products"
            >
              Hacer mi pedido
            </Button>
            <Button
              as={Link}
              className="text-white border-white/60 hover:bg-white/10 font-semibold"
              size="lg"
              startContent={<FaTruckFast />}
              to="/zonas-de-entrega"
              variant="bordered"
            >
              Zonas de entrega
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Comprá por categorías
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Productos seleccionados con el mismo cuidado que vos elegirías
            </p>
          </div>
          <Button
            as={Link}
            color="primary"
            endContent={<FaArrowRight />}
            to="/products"
            variant="ghost"
          >
            Ver todo el catálogo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              isPressable
              className="py-2 border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-900"
            >
              <CardHeader className="pb-0 pt-4 px-5 flex-col items-start">
                <div className="flex justify-between w-full items-center mb-3">
                  <Chip
                    className="font-bold uppercase text-[10px]"
                    color="secondary"
                    size="sm"
                    variant="flat"
                  >
                    {feature.tag}
                  </Chip>
                  <div className="bg-primary/10 p-2 rounded-lg text-primary text-xl">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-bold text-xl text-slate-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-snug line-clamp-2">
                  {feature.description}
                </p>
              </CardHeader>

              <CardBody className="overflow-visible py-4 px-4 items-center">
                <Image
                  isZoomed
                  alt={feature.title}
                  className="object-cover rounded-2xl w-full h-52 shadow-md"
                  src={feature.image}
                  width="100%"
                />
              </CardBody>

              <CardFooter className="px-5 pb-5">
                <Button
                  as={Link}
                  className="w-full font-bold"
                  color="primary"
                  endContent={<FaArrowRight className="text-sm" />}
                  to={feature.link}
                  variant="flat"
                >
                  {feature.linkText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Badges - Stats adaptadas a primary/secondary */}
      <section className="bg-white dark:bg-zinc-900 py-16 border-y border-slate-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary">
                <FaTruckFast size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                Envío Express
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Entregamos en menos de 90 min en tu barrio.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 rounded-full bg-secondary/10 text-secondary">
                <FaBasketShopping size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                +2500 Artículos
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Desde básicos de almacén hasta productos gourmet.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary">
                <FaHouseChimney size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                Soporte Local
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Atención personalizada y humana para tu tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
