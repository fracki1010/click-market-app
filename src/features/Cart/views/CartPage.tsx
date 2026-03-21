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
  const {
    calculateServiceCost,
    isMinimumProductsMet,
    getMinimumProductsMessage,
  } = useShippingSettings();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const serviceCost = calculateServiceCost(subtotal);
  const grandTotal = subtotal + serviceCost;
  const totalProductUnits = items.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );
  const minimumReached = isMinimumProductsMet(totalProductUnits);

  return (
    <main className="flex-grow bg-background transition-colors min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-content1 border-b border-divider pt-12 pb-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-success font-bold mb-2 uppercase tracking-widest text-xs"
              >
                <FaStore /> Click Market
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-default-800 flex items-center gap-4">
                Mi Canasta{" "}
                <span className="text-default-300">({items.length})</span>
              </h1>
            </div>

            {items.length > 0 && (
              <div className="text-right">
                <p className="text-default-500 font-medium">
                  Revisa tus productos antes de finalizar el pedido.
                </p>
                <p
                  className={`text-sm font-semibold ${
                    minimumReached ? "text-success" : "text-warning"
                  }`}
                >
                  {getMinimumProductsMessage(totalProductUnits)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna Izquierda: Lista de Productos */}
          <div className="lg:w-[65%]">
            {items.length > 0 ? (
              <div className="bg-content1 rounded-[2.5rem] shadow-sm border border-divider overflow-hidden">
                <div className="p-2 sm:p-6">
                  <div className="divide-y divide-divider">
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
                className="bg-content1 rounded-[2.5rem] shadow-sm border border-divider p-16 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-success-100 rounded-full animate-ping opacity-25" />
                  <div className="relative flex items-center justify-center w-full h-full bg-success-50 rounded-full">
                    <FaBasketShopping className="text-6xl text-success" />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-default-800 mb-4">
                  ¡Tu canasta está vacía!
                </h3>
                <p className="text-default-500 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                  Descubrí los mejores productos y ofertas imperdibles que
                  tenemos para vos.
                </p>

                <Button
                  as={Link}
                  className="bg-success text-white font-black px-10 h-14 text-lg shadow-xl shadow-success/20 hover:bg-success-600 transition-all active:scale-95"
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
                serviceCost={serviceCost}
                subtotal={subtotal}
                total={grandTotal}
              />

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-6 px-4">
                <div className="flex flex-col items-center gap-1 opacity-50 gray-scale hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase text-default-500">
                    Pago Seguro
                  </span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-default-200 rounded" />
                    <div className="w-8 h-5 bg-default-200 rounded" />
                  </div>
                </div>
                <div className="h-8 w-px bg-divider" />
                <div className="flex flex-col items-center gap-1 opacity-50 gray-scale hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase text-default-500">
                    Garantía Click
                  </span>
                  <FaBagShopping className="text-default-400 text-lg" />
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
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-content1/80 backdrop-blur-xl border-t border-divider p-4 z-50 flex items-center justify-between gap-4 pb-safe"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-default-500 leading-none">
                Total
              </span>
              <span className="text-2xl font-black text-default-900 leading-tight">
                ${formatPrice(grandTotal)}
              </span>
            </div>
            <Button
              className={`font-black px-8 h-12 shadow-lg active:scale-95 transition-all ${
                minimumReached
                  ? "bg-primary text-primary-foreground shadow-primary/20"
                  : "bg-default-200 text-default-500 shadow-none"
              }`}
              isDisabled={!minimumReached}
              endContent={<FaArrowRight />}
              radius="full"
              onClick={() => {
                if (items.length === 0 || !minimumReached) return;
                navigate("/checkout");
              }}
            >
              {minimumReached ? "Comprar" : "Mínimo no alcanzado"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
