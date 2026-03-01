import React from "react";
import { formatPrice } from "@/utils/currencyFormat";
import { Link, useNavigate } from "react-router";
import { Chip, Button, Progress } from "@heroui/react";
import {
  FaTruckFast,
  FaArrowRight,
  FaBagShopping,
  FaCircleCheck,
} from "react-icons/fa6";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../../Auth/hooks/useAuth";

import { useShippingSettings } from "../../Settings/hooks/useShippingSettings";

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
  const { thresholdConfig } = useShippingSettings();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  const progressValue = Math.min((subtotal / thresholdConfig) * 100, 100);
  const remainingForFreeShipping = thresholdConfig - subtotal;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-zinc-800 flex flex-col gap-6">
      <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
        <FaBagShopping className="text-orange-500" /> Resumen
      </h2>

      {/* Free Shipping Progress */}
      {subtotal > 0 && (
        <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-600 dark:text-zinc-400">
              {shipping === 0 ? "¡Tenés envío gratis!" : "Envío gratis"}
            </span>
            {shipping === 0 && <FaCircleCheck className="text-emerald-500" />}
          </div>
          <Progress
            color={shipping === 0 ? "success" : "warning"}
            size="md"
            value={progressValue}
            className="mb-2"
          />
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              Faltan{" "}
              <span className="font-bold text-slate-700 dark:text-zinc-300">
                ${formatPrice(remainingForFreeShipping)}
              </span>{" "}
              para envío gratis
            </p>
          ) : (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Tu pedido califica para envío sin cargo
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
          <span className="font-medium font-outfit">Subtotal productos</span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">
            ${formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
          <span className="flex items-center gap-2 font-medium">
            <FaTruckFast className="text-slate-400" /> Envío
          </span>
          {shipping === 0 && subtotal > 0 ? (
            <Chip
              className="font-black px-2"
              color="success"
              size="sm"
              variant="flat"
            >
              GRATIS
            </Chip>
          ) : (
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              ${formatPrice(shipping)}
            </span>
          )}
        </div>

        <div className="pt-4 border-t-2 border-dashed border-slate-100 dark:border-zinc-800 flex justify-between items-end">
          <div>
            <span className="text-sm uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">
              Total a pagar
            </span>
            <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">
              ${formatPrice(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Button
          className={`h-16 text-xl font-black shadow-lg transition-all
            ${
              items.length === 0
                ? ""
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
            }`}
          disabled={items.length === 0}
          endContent={user && items.length > 0 ? <FaArrowRight /> : null}
          radius="lg"
          size="lg"
          onClick={handleCheckout}
        >
          {user ? "Continuar Compra" : "Iniciar Sesión"}
        </Button>

        <Button
          as={Link}
          className="font-bold text-slate-500 dark:text-zinc-400"
          to="/products"
          variant="light"
        >
          Seguir comprando
        </Button>
      </div>
    </div>
  );
};
