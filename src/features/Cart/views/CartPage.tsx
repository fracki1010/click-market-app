import type { ICartItem } from "../types/Cart";

import React, { useEffect } from "react";
import { Link } from "react-router";
import { FaBasketShopping } from "react-icons/fa6";

import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { useCart } from "../hooks/useCart";

export const CartPage: React.FC = () => {
  const { items, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Lógica de Click Market (Supermercado)
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 20000 ? 0 : 1500;
  const grandTotal = subtotal + shipping;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-slate-50 dark:bg-zinc-950 transition-colors min-h-screen">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
        <FaBasketShopping className="text-emerald-500" /> Mi Canasta
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna Izquierda: Lista de Productos */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6">
            <div className="hidden sm:grid grid-cols-6 gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <div className="col-span-3">Producto</div>
              <div className="text-center">Precio</div>
              <div className="text-center">Cantidad</div>
              <div className="text-right">Total</div>
            </div>

            {items.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {items.map((item: ICartItem) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <FaBasketShopping className="text-6xl mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Tu canasta está vacía
                </h3>
                <p className="mb-6">
                  Descubrí productos frescos y ofertas para llenar tu heladera.
                </p>
                <Link
                  className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
                  to="/products"
                >
                  Ir al Supermercado
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:w-1/3">
          <CartSummary
            shipping={shipping}
            subtotal={subtotal}
            total={grandTotal}
          />
        </div>
      </div>
    </main>
  );
};
