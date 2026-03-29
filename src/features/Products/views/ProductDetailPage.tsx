import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Skeleton,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiMinus,
  FiPlus,
  FiStar,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiImage,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

import { useProduct } from "../hooks/useProduct";
import {
  getRatingFromTopSellerRank,
  getReviewCountFromTopSellerRank,
  getVisualStarsCount,
} from "../utils/topSellerRating";

import { useCart } from "@/features/Cart/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPrice } from "@/utils/currencyFormat";

const DEFAULT_STOCK_MOCK = 15;

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const productId = id || "";
  const { data: product, isLoading, isError } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [activeImageError, setActiveImageError] = useState(false);

  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(product.imageUrl);
    }
    window.scrollTo(0, 0);
  }, [product]);

  useEffect(() => {
    setActiveImageError(false);
  }, [activeImage]);

  const currentStock = (product as any)?.stock ?? DEFAULT_STOCK_MOCK;
  const isOutOfStock = currentStock === 0;
  const topSellerRating = getRatingFromTopSellerRank(product?.topSellerRank);
  const reviewCount = getReviewCountFromTopSellerRank(product?.topSellerRank);
  const visualStars = getVisualStarsCount(topSellerRating);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newVal = prev + delta;

      if (newVal < 1) return 1;
      if (newVal > currentStock) return currentStock;

      return newVal;
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    addItem(product, quantity);
    addToast(`${product.name} agregado al carrito`, "success");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen-safe flex flex-col bg-background">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Skeleton className="aspect-square rounded-[3rem]" />
            <div className="space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-full h-16 rounded-2xl" />
                <Skeleton className="w-32 h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-full h-4 rounded-full" />
                <Skeleton className="w-full h-4 rounded-full" />
                <Skeleton className="w-2/3 h-4 rounded-full" />
              </div>
              <Skeleton className="w-full h-16 rounded-3xl mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen-safe flex flex-col items-center justify-center bg-background p-4">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
        >
          <div className="text-8xl">🏜️</div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
            Producto no disponible
          </h2>
          <Button
            className="bg-indigo-600 text-white font-black px-8 h-12 rounded-2xl"
            onPress={() => navigate("/products")}
          >
            Volver al Catálogo
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen-safe flex flex-col bg-background pb-20 md:pb-10">
      {/* Volver y Navegación */}
      <div className="sticky top-[var(--app-header-height)] z-40 border-b border-divider bg-background/90 py-3 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
          <Button
            className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-900 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white"
            startContent={<FiArrowLeft />}
            onPress={() => navigate(-1)}
          >
            Atrás
          </Button>
          <div className="hidden md:block">
            <Breadcrumbs classNames={{ list: "gap-2" }} size="sm">
              <BreadcrumbItem
                className="font-bold text-[10px] uppercase tracking-wider text-gray-400"
                onPress={() => navigate("/home")}
              >
                Inicio
              </BreadcrumbItem>
              <BreadcrumbItem
                className="font-bold text-[10px] uppercase tracking-wider text-gray-400"
                onPress={() => navigate("/products")}
              >
                Catálogo
              </BreadcrumbItem>
              <BreadcrumbItem className="font-black text-[10px] uppercase tracking-wider text-indigo-500">
                {product.name}
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
          {topSellerRating !== null && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
                <FiStar className="text-indigo-500" size={14} />
              </div>
              <span className="text-xs font-black text-indigo-500">
                {topSellerRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Lado Izquierdo: Galería Immersiva */}
          <div className="relative group">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-2xl shadow-indigo-500/5 flex items-center justify-center p-8 lg:p-12"
              initial={{ opacity: 0, y: 20 }}
            >
              <AnimatePresence mode="wait">
                {activeImage && !activeImageError ? (
                  <motion.img
                    key={activeImage}
                    alt={product.name}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    exit={{ opacity: 0, scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    src={activeImage}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    onError={() => setActiveImageError(true)}
                  />
                ) : (
                  <motion.div
                    key="product-image-fallback"
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500"
                    exit={{ opacity: 0, scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.98 }}
                  >
                    <FiImage size={44} />
                    <span className="mt-3 text-xs font-black uppercase tracking-widest">
                      Sin imagen
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badges de producto */}
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                <Chip
                  className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest px-4 h-8 border-none"
                  variant="flat"
                >
                  Novedad
                </Chip>
                <Chip
                  className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-widest px-4 h-8 border border-gray-100 dark:border-neutral-700 shadow-sm"
                  variant="flat"
                >
                  Original
                </Chip>
              </div>
            </motion.div>

            {/* Thumbnails (Simulados por ahora) */}
            <div className="flex gap-4 mt-6 justify-center lg:justify-start overflow-x-auto no-scrollbar py-2">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map(
                (img, i) => (
                  <button
                    key={i}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-indigo-600 scale-105 shadow-lg shadow-indigo-600/20" : "border-gray-100 dark:border-neutral-800 opacity-60 hover:opacity-100"}`}
                    onClick={() => setActiveImage(img || "")}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-neutral-500">
                      <FiImage size={16} />
                      {img && (
                        <img
                          alt="prev"
                          className="absolute inset-0 w-full h-full object-cover"
                          src={img}
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.opacity = "0";
                          }}
                        />
                      )}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Lado Derecho: Información refinada */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  Detalles
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                {product.name}
              </h1>

              {topSellerRating !== null && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < visualStars ? "opacity-100" : "opacity-30"
                        }
                        size={13}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-gray-500 dark:text-neutral-400">
                    {topSellerRating.toFixed(1)}
                    {reviewCount ? ` (${reviewCount})` : ""}
                    {product.topSellerRank
                      ? ` · TOP #${product.topSellerRank}`
                      : ""}
                  </span>
                </div>
              )}

              <div className="flex items-end gap-4 pt-4">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-neutral-500 tracking-tighter">
                  ${formatPrice(product.price)}
                </span>
                <span className="text-gray-400 line-through text-xl font-bold mb-1 opacity-50">
                  ${formatPrice(product.price * 1.2)}
                </span>
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-neutral-400 text-lg leading-relaxed font-medium"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.description ||
                "Este producto ha sido cuidadosamente seleccionado por Click Market para garantizar la mejor calidad y satisfacción. Disfruta de un diseño elegante y funcional que se adapta a tu estilo de vida."}
            </motion.p>

            {/* Trust Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 dark:border-neutral-800">
                  <FiTruck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Entrega
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Mañana
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 dark:border-neutral-800">
                  <FiShield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Calidad
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Garantizada
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 dark:border-neutral-800">
                  <FiCheckCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Frescura
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Garantizada
                  </p>
                </div>
              </div>
            </div>

            <Divider className="opacity-50" />

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6 pt-4">
              <div className="flex items-center bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl h-16 p-2">
                <Button
                  isIconOnly
                  isDisabled={quantity <= 1}
                  radius="md"
                  size="sm"
                  variant="light"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <FiMinus size={18} />
                </Button>
                <span className="w-12 text-center font-black text-xl text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  isDisabled={quantity >= currentStock}
                  radius="md"
                  size="sm"
                  variant="light"
                  onClick={() => handleQuantityChange(1)}
                >
                  <FiPlus size={18} />
                </Button>
              </div>
              <Button
                fullWidth
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-transform active:scale-95"
                isDisabled={isOutOfStock}
                startContent={<FiShoppingBag size={20} />}
                onPress={handleAddToCart}
              >
                {isOutOfStock ? "Sin Stock" : "Agregar a la bolsa"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <motion.div
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-2xl border-t border-gray-100 dark:border-neutral-900 p-6 z-50 lg:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
        initial={{ y: 100 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 dark:bg-neutral-900 rounded-2xl p-1 shrink-0">
            <Button
              isIconOnly
              className="min-w-unit-10 h-10"
              isDisabled={quantity <= 1}
              size="sm"
              variant="light"
              onClick={() => handleQuantityChange(-1)}
            >
              <FiMinus />
            </Button>
            <span className="w-8 text-center font-black text-gray-900 dark:text-white">
              {quantity}
            </span>
            <Button
              isIconOnly
              className="min-w-unit-10 h-10"
              isDisabled={quantity >= currentStock}
              size="sm"
              variant="light"
              onClick={() => handleQuantityChange(1)}
            >
              <FiPlus />
            </Button>
          </div>
          <Button
            fullWidth
            className="bg-indigo-600 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
            isDisabled={isOutOfStock}
            startContent={<FiShoppingBag />}
            onPress={handleAddToCart}
          >
            {isOutOfStock ? "Sin Stock" : "Agregar"}
          </Button>
        </div>
      </motion.div>
    </main>
  );
};
