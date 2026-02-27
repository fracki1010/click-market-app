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
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { useProduct } from "../hooks/useProduct";
import { useCart } from "@/features/Cart/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";

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

  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(product.imageUrl);
    }
    window.scrollTo(0, 0);
  }, [product]);

  const currentStock = (product as any)?.stock ?? DEFAULT_STOCK_MOCK;
  const isOutOfStock = currentStock === 0;

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
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
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
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
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
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col pb-32 lg:pb-12">
      {/* Volver y Navegación */}
      <div className="sticky top-[72px] z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 py-4">
        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
          <Button
            className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-900 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white"
            startContent={<FiArrowLeft />}
            onPress={() => navigate(-1)}
          >
            Atrás
          </Button>
          <div className="hidden md:block">
            <Breadcrumbs size="sm" classNames={{ list: "gap-2" }}>
              <BreadcrumbItem
                onPress={() => navigate("/home")}
                className="font-bold text-[10px] uppercase tracking-wider text-gray-400"
              >
                Inicio
              </BreadcrumbItem>
              <BreadcrumbItem
                onPress={() => navigate("/products")}
                className="font-bold text-[10px] uppercase tracking-wider text-gray-400"
              >
                Catálogo
              </BreadcrumbItem>
              <BreadcrumbItem className="font-black text-[10px] uppercase tracking-wider text-indigo-500">
                {product.name}
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
              <FiStar className="text-indigo-500" size={14} />
            </div>
            <span className="text-xs font-black text-indigo-500">4.9</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Lado Izquierdo: Galería Immersiva */}
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-2xl shadow-indigo-500/5 flex items-center justify-center p-8 lg:p-12"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  src={
                    activeImage || "https://placehold.co/800x800?text=No+Data"
                  }
                />
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
                    onClick={() => setActiveImage(img || "")}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-indigo-600 scale-105 shadow-lg shadow-indigo-600/20" : "border-gray-100 dark:border-neutral-800 opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt="prev"
                    />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Lado Derecho: Información refinada */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  Detalles
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
                {product.name}
              </h1>

              <div className="flex items-end gap-4 pt-4">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-neutral-500 tracking-tighter">
                  ${product.price.toLocaleString("es-AR")}
                </span>
                <span className="text-gray-400 line-through text-xl font-bold mb-1 opacity-50">
                  ${(product.price * 1.2).toLocaleString("es-AR")}
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 dark:text-neutral-400 text-lg leading-relaxed font-medium"
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
                    Hoy
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
                  variant="light"
                  size="sm"
                  radius="md"
                  onClick={() => handleQuantityChange(-1)}
                  isDisabled={quantity <= 1}
                >
                  <FiMinus size={18} />
                </Button>
                <span className="w-12 text-center font-black text-xl text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  radius="md"
                  onClick={() => handleQuantityChange(1)}
                  isDisabled={quantity >= currentStock}
                >
                  <FiPlus size={18} />
                </Button>
              </div>
              <Button
                fullWidth
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-transform active:scale-95"
                startContent={<FiShoppingBag size={20} />}
                onPress={handleAddToCart}
                isDisabled={isOutOfStock}
              >
                {isOutOfStock ? "Sin Stock" : "Agregar a la bolsa"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-2xl border-t border-gray-100 dark:border-neutral-900 p-6 z-50 lg:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 dark:bg-neutral-900 rounded-2xl p-1 shrink-0">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="min-w-unit-10 h-10"
              onClick={() => handleQuantityChange(-1)}
              isDisabled={quantity <= 1}
            >
              <FiMinus />
            </Button>
            <span className="w-8 text-center font-black text-gray-900 dark:text-white">
              {quantity}
            </span>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="min-w-unit-10 h-10"
              onClick={() => handleQuantityChange(1)}
              isDisabled={quantity >= currentStock}
            >
              <FiPlus />
            </Button>
          </div>
          <Button
            fullWidth
            className="bg-indigo-600 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
            startContent={<FiShoppingBag />}
            onPress={handleAddToCart}
            isDisabled={isOutOfStock}
          >
            {isOutOfStock ? "Sin Stock" : "Agregar"}
          </Button>
        </div>
      </motion.div>
    </main>
  );
};
