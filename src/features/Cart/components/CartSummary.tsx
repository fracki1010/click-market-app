import React from "react";
import { Link, useNavigate } from "react-router";
import { Chip } from "@heroui/react";
import { FaTruckFast, FaArrowRight } from "react-icons/fa6";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../../Auth/hooks/useAuth";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  total,
}) => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-100 dark:border-zinc-800">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white border-b pb-4 dark:border-zinc-800">
        Resumen de Compra
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Subtotal de productos</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2">
            <FaTruckFast className="text-slate-400" /> Envío a Domicilio
          </span>
          {shipping === 0 && subtotal > 0 ? (
            <Chip
              className="font-bold"
              color="success"
              size="sm"
              variant="flat"
            >
              Gratis
            </Chip>
          ) : (
            <span className="font-medium">${shipping.toFixed(2)}</span>
          )}
        </div>

        {subtotal > 0 && subtotal < 20000 && (
          <p className="text-xs text-orange-500 font-medium text-center bg-orange-50 p-2 rounded-lg dark:bg-orange-900/20">
            Agrega ${(20000 - subtotal).toFixed(2)} más para obtener envío
            gratis.
          </p>
        )}

        <div className="border-t pt-4 mt-4 flex justify-between items-center text-lg">
          <span className="font-bold text-slate-800 dark:text-white">
            Total
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-md
          ${
            items.length === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-zinc-800"
              : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/30"
          }`}
        disabled={items.length === 0}
        onClick={handleCheckout}
      >
        {user ? "Elegir Horario de Entrega" : "Ingresar para Pagar"}
        {user && items.length > 0 && <FaArrowRight />}
      </button>

      <div className="mt-4 text-center">
        <Link
          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          to="/products"
        >
          Volver a las góndolas
        </Link>
      </div>
    </div>
  );
};
