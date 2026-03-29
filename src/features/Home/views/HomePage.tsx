import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import {
  FaArrowRight,
  FaTruckFast,
  FaTags,
  FaBoxOpen,
  FaSprayCan,
  FaBolt,
  FaStar,
  FaCartShopping,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/react";

import { useShippingSettings } from "@/features/Settings/hooks/useShippingSettings";
import { useTopSellers } from "@/features/Products/hooks/useTopSellers";
import { formatPrice } from "@/utils/currencyFormat";
import { warmupRouteOnIntent } from "@/routes/routeWarmup";

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
    color: "bg-warning",
    link: "/products?categories=OFERTAS",
  },
  {
    id: 2,
    label: "Más vendidos",
    icon: <FaStar />,
    color: "bg-success",
    link: "/products?sort=best_sellers",
  },
  {
    id: 3,
    label: "Almacén",
    icon: <FaBoxOpen />,
    color: "bg-primary",
    link: "/products?categories=ALMACÉN",
  },
  {
    id: 4,
    label: "Limpieza",
    icon: <FaSprayCan />,
    color: "bg-secondary",
    link: "/products?categories=LIMPIEZA",
  },
  {
    id: 5,
    label: "Express",
    icon: <FaBolt />,
    color: "bg-warning",
    link: "/products",
  },
];

interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  route: string;
}

const baseBanners: HomeBanner[] = [
  {
    id: "banner-limpieza",
    title: "Limpieza Total",
    subtitle: "Todo para que tu casa brille",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    color: "from-secondary to-success",
    route: "/products?categories=LIMPIEZA",
  },
  {
    id: "banner-ofertas",
    title: "Liquidación Invierno",
    subtitle: "Hasta 40% OFF en seleccionados",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200",
    color: "from-primary to-secondary",
    route: "/products?categories=OFERTAS",
  },
];

export const HomePage: React.FC = () => {
  const {
    thresholdConfig,
    minimumProductsConfig,
    isLoading: isLoadingShipping,
  } = useShippingSettings();
  const { data: topSellers, isLoading } = useTopSellers();
  const bannerTrackRef = useRef<HTMLDivElement | null>(null);
  const isBannerPausedRef = useRef(false);
  const warmup = (to: string) => warmupRouteOnIntent(to);

  const banners = useMemo<HomeBanner[]>(() => {
    const gradients = [
      "from-primary to-secondary",
      "from-success to-primary",
      "from-warning to-danger",
      "from-secondary to-primary",
      "from-primary to-warning",
    ];

    const productBanners =
      topSellers?.slice(0, 6).map((product, index) => ({
        id: `product-banner-${product._id}`,
        title: product.name,
        subtitle: `Top #${index + 1} en ventas`,
        image:
          product.image ||
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
        color: gradients[index % gradients.length],
        route: `/products?search=${encodeURIComponent(product.name)}`,
      })) || [];

    return [...baseBanners, ...productBanners];
  }, [topSellers]);

  const infiniteBanners = useMemo(
    () => (banners.length > 1 ? [...banners, ...banners] : banners),
    [banners],
  );

  useEffect(() => {
    const el = bannerTrackRef.current;

    if (!el || banners.length <= 1) return;

    const speed = 1;
    const intervalId = window.setInterval(() => {
      if (isBannerPausedRef.current) return;
      const halfWidth = el.scrollWidth / 2;

      el.scrollLeft += speed;

      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }
    }, 18);

    return () => window.clearInterval(intervalId);
  }, [banners.length]);

  return (
    <div className="min-h-screen-safe flex flex-col gap-6 pb-6">
      {/* Banner Section - Slider-like experience */}
      <section className="mt-1 px-4">
        <div
          ref={bannerTrackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
          onMouseEnter={() => {
            isBannerPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isBannerPausedRef.current = false;
          }}
          onTouchEnd={() => {
            isBannerPausedRef.current = false;
          }}
          onTouchStart={() => {
            isBannerPausedRef.current = true;
          }}
        >
          {infiniteBanners.map((banner, index) => (
            <div
              key={`${banner.id}-${index}`}
              className="relative h-48 min-w-[86vw] overflow-hidden rounded-2xl shadow-xl md:min-w-[45vw] lg:min-w-[30vw]"
            >
              <img
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
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
                  as={Link}
                  className="w-fit font-bold"
                  radius="full"
                  size="sm"
                  to={banner.route}
                  variant="solid"
                  onMouseEnter={() => warmup(banner.route)}
                  onTouchStart={() => warmup(banner.route)}
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
        <div className="no-scrollbar flex items-center justify-between gap-6 overflow-x-auto py-2">
          {quickLinks.map((item) => (
            <Link
              key={item.id}
              className="flex flex-col items-center gap-2 shrink-0 group"
              to={item.link}
              onMouseEnter={() => warmup(item.link)}
              onTouchStart={() => warmup(item.link)}
            >
              <motion.div
                className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-primary/10`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.div>
              <span className="text-[11px] font-bold text-default-700 group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Delivery Info Card */}
      <section className="px-4">
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-content1 dark:to-content1 border-none shadow-sm">
          <CardBody className="flex-row items-center gap-4 px-4 py-3">
            <div className="bg-background p-2.5 rounded-full shadow-sm text-primary">
              <FaTruckFast size={20} />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-default-800">
                Envío Gratis
              </h4>
              <p className="text-[11px] text-default-500 font-medium">
                En tu primera compra superior a ${formatPrice(thresholdConfig)}
              </p>
            </div>
            <Button
              isIconOnly
              as={Link}
              className="bg-background text-default-400 rotate-0"
              radius="full"
              size="sm"
              to="/products"
              variant="flat"
              onMouseEnter={() => warmup("/products")}
              onTouchStart={() => warmup("/products")}
            >
              <FaArrowRight size={12} />
            </Button>
          </CardBody>
        </Card>
      </section>

      {/* Minimum Products Card */}
      <section className="px-4">
        <Card className="bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-content1 dark:to-content1 border-none shadow-sm">
          <CardBody className="flex-row items-center gap-4 px-4 py-3">
            <div className="bg-background p-2.5 rounded-full shadow-sm text-secondary">
              <FaCartShopping size={20} />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-default-800">
                Pedido por Productos
              </h4>
              <p className="text-[11px] text-default-500 font-medium">
                {isLoadingShipping
                  ? "Cargando mínimo de productos..."
                  : minimumProductsConfig > 0
                    ? `Pedido mínimo de ${minimumProductsConfig} productos`
                    : "Sin mínimo de productos para comprar"}
              </p>
            </div>
            <Button
              isIconOnly
              as={Link}
              className="bg-background text-default-400 rotate-0"
              radius="full"
              size="sm"
              to="/products"
              variant="flat"
              onMouseEnter={() => warmup("/products")}
              onTouchStart={() => warmup("/products")}
            >
              <FaArrowRight size={12} />
            </Button>
          </CardBody>
        </Card>
      </section>

      {/* Categories Grid (More visual) */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black text-default-800 tracking-tight">
            Categorías destacadas
          </h3>
          <Link
            className="text-xs font-bold text-primary hover:underline"
            to="/categories"
            onMouseEnter={() => warmup("/categories")}
            onTouchStart={() => warmup("/categories")}
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
            onMouseEnter={() => warmup("/products?categories=ALMACÉN")}
            onTouchStart={() => warmup("/products?categories=ALMACÉN")}
          >
            <img
              alt="Almacen"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
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
              to="/products?categories=LIMPIEZA"
              onMouseEnter={() => warmup("/products?categories=LIMPIEZA")}
              onTouchStart={() => warmup("/products?categories=LIMPIEZA")}
            >
              <img
                alt="Limpieza"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=400"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <h4 className="text-white font-bold text-sm leading-tight">
                  Limpieza
                </h4>
              </div>
            </Card>
            <Card
              isPressable
              as={Link}
              className="h-[88px] border-none relative overflow-hidden group shadow-md"
              to="/products?categories=OFERTAS"
              onMouseEnter={() => warmup("/products?categories=OFERTAS")}
              onTouchStart={() => warmup("/products?categories=OFERTAS")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-warning to-danger" />
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
          <h3 className="text-xl font-black text-default-800 tracking-tight">
            Elegidos para vos
          </h3>
          <Link
            className="text-xs font-bold text-primary"
            to="/products?sort=best_sellers"
            onMouseEnter={() => warmup("/products?sort=best_sellers")}
            onTouchStart={() => warmup("/products?sort=best_sellers")}
          >
            Ver más
          </Link>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
          {isLoading ? (
            // Skeletons while loading
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[170px] space-y-3">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>
            ))
          ) : topSellers && topSellers.length > 0 ? (
            topSellers.map((product) => (
              <Card
                key={product._id}
                isPressable
                as={Link}
                className="min-w-[170px] max-w-[170px] border-divider shadow-md hover:shadow-lg transition-all bg-content1"
                to={`/products?search=${product.name}`}
                onMouseEnter={() => warmup("/products")}
                onTouchStart={() => warmup("/products")}
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-32">
                    {product.image ? (
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        src={product.image}
                      />
                    ) : (
                      <div className="w-full h-full bg-default-100 flex items-center justify-center">
                        <FaBoxOpen className="text-default-300 text-3xl" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Chip
                        className="font-bold text-[9px] h-5"
                        color="success"
                        size="sm"
                        variant="solid"
                      >
                        TOP
                      </Chip>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-3">
                  <p className="text-primary font-black text-base">
                    ${formatPrice(product.currentPrice)}
                  </p>
                  <h4 className="text-[12px] text-default-700 font-bold line-clamp-2 mt-1 leading-tight uppercase">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] text-default-400 font-bold">
                      {product.totalSold} vendidos
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <p className="text-sm text-gray-500">Cargando ofertas...</p>
          )}
        </div>
      </section>

      {/* Trust/About Section */}
      <section className="px-4 py-8 bg-background">
        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-default-800 mb-2">
            ¿Por qué elegir Click Market?
          </h3>
          <p className="text-xs text-default-500 font-medium">
            Tu confianza es nuestro motor diario
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center text-center p-4 bg-default-50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary mb-3 flex items-center justify-center">
              <FaStar size={18} />
            </div>
            <h4 className="text-xs font-bold text-default-800 mb-1">
              Calidad Premium
            </h4>
            <p className="text-[10px] text-default-400">
              Seleccionamos lo mejor para vos.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-default-50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary mb-3 flex items-center justify-center">
              <FaBolt size={18} />
            </div>
            <h4 className="text-xs font-bold text-default-800 mb-1">
              Entrega Flash
            </h4>
            <p className="text-[10px] text-default-400">
              En la puerta de tu casa hoy mismo.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            className="text-xs font-black text-primary uppercase tracking-wider hover:underline"
            to="/nosotros"
          >
            Conocé nuestra historia →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-4">
        <div className="bg-primary rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-2xl font-black mb-2 relative z-10">
            ¿Listo para llenar el carrito?
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">
            Descubrí miles de productos seleccionados para vos con entrega en el
            día.
          </p>
          <Button
            as={Link}
            className="bg-background text-primary font-black px-8 py-6 text-base shadow-xl"
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
