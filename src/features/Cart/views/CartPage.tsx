import type { ICartItem } from "../types/Cart";

import React, { useEffect } from "react";
import { formatPrice } from "@/utils/currencyFormat";
import { Link, useNavigate } from "react-router";
import {
  FaBasketShopping,
  FaBagShopping,
  FaStore,
  FaArrowRight,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { useCart } from "../hooks/useCart";
import { useShippingSettings } from "../../Settings/hooks/useShippingSettings";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, fetchCart } = useCart();
  const { calculateShipping } = useShippingSettings();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = calculateShipping(subtotal);
  const grandTotal = subtotal + shipping;

  return (
    <main className="flex-grow bg-slate-50 dark:bg-zinc-950 transition-colors min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-12 pb-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase tracking-widest text-xs"
              >
                <FaStore /> Click Market
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white flex items-center gap-4">
                Mi Canasta{" "}
                <span className="text-slate-300 dark:text-zinc-700">
                  ({items.length})
                </span>
              </h1>
            </div>

            {items.length > 0 && (
              <p className="text-slate-500 dark:text-zinc-400 font-medium">
                Revisa tus productos antes de finalizar el pedido.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna Izquierda: Lista de Productos */}
          <div className="lg:w-[65%]">
            {items.length > 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-2 sm:p-6">
                  <div className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                    <AnimatePresence mode="popLayout">
                      {items.map((item: ICartItem) => (
                        <CartItem key={item.productId} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800 p-16 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 rounded-full animate-ping opacity-25" />
                  <div className="relative flex items-center justify-center w-full h-full bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                    <FaBasketShopping className="text-6xl text-emerald-500" />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">
                  ¡Tu canasta está vacía!
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                  Descubrí los mejores productos y ofertas imperdibles que
                  tenemos para vos.
                </p>

                <Button
                  as={Link}
                  className="bg-emerald-600 text-white font-black px-10 h-14 text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                  radius="full"
                  to="/products"
                >
                  Ir al Supermercado
                </Button>
              </motion.div>
            )}
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:w-[35%]">
            <div className="sticky top-28">
              <CartSummary
                shipping={shipping}
                subtotal={subtotal}
                total={grandTotal}
              />

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-6 px-4">
                <div className="flex flex-col items-center gap-1 opacity-50 gray-scale hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400">
                    Pago Seguro
                  </span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-slate-200 dark:bg-zinc-800 rounded" />
                    <div className="w-8 h-5 bg-slate-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:border-zinc-800" />
                <div className="flex flex-col items-center gap-1 opacity-50 gray-scale hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400">
                    Garantía Click
                  </span>
                  <FaBagShopping className="text-slate-400 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 p-4 z-50 flex items-center justify-between gap-4 pb-safe"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-500 leading-none">
                Total
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                ${formatPrice(grandTotal)}
              </span>
            </div>
            <Button
              className="bg-orange-500 text-white font-black px-8 h-12 shadow-lg shadow-orange-500/20 active:scale-95"
              endContent={<FaArrowRight />}
              radius="full"
              onClick={() => {
                if (items.length === 0) return;
                navigate("/checkout");
              }}
            >
              Comprar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
