import React from "react";
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

import { formatPrice } from "@/utils/currencyFormat";

interface CartSummaryProps {
  subtotal: number;
  serviceCost: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  serviceCost,
  total,
}) => {
  const subtotalRounded = Math.round((subtotal + Number.EPSILON) * 100) / 100;
  const subtotalFormatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(subtotalRounded);

  const navigate = useNavigate();
  const { items } = useCart();
  const { token } = useAuth();
  const { thresholdConfig, isMinimumProductsMet, getMinimumProductsMessage } =
    useShippingSettings();
  const totalProductUnits = items.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );
  const minimumReached = isMinimumProductsMet(totalProductUnits);

  const handleCheckout = () => {
    if (items.length === 0 || !minimumReached) return;
    if (!token) {
      navigate("/login", {
        state: { from: { pathname: "/checkout" } },
      });

      return;
    }
    navigate("/checkout");
  };

  const progressValue = Math.min((subtotal / thresholdConfig) * 100, 100);
  const remainingForFreeShipping = thresholdConfig - subtotal;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-divider bg-content1 p-6 shadow-xl sm:p-8">
      <h2 className="flex items-center gap-2 text-2xl font-black text-default-800">
        <FaBagShopping className="text-primary" /> Resumen
      </h2>

      {/* Free Shipping Progress */}
      {subtotal > 0 && (
        <div className="rounded-2xl border border-divider bg-default-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-default-600">
              {serviceCost === 0
                ? "¡Tenés costo del servicio gratis!"
                : "Costo del servicio gratis"}
            </span>
            {serviceCost === 0 && <FaCircleCheck className="text-success" />}
          </div>
          <Progress
            className="mb-2"
            color={serviceCost === 0 ? "success" : "warning"}
            size="md"
            value={progressValue}
          />
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-default-500">
              Faltan{" "}
              <span className="font-bold text-default-700">
                ${formatPrice(remainingForFreeShipping)}
              </span>{" "}
              para costo del servicio gratis
            </p>
          ) : (
            <p className="text-xs text-success font-medium">
              Tu pedido califica para costo del servicio sin cargo
            </p>
          )}
        </div>
      )}

      <div
        className={`rounded-2xl border p-4 ${
          minimumReached
            ? "bg-success-50 border-success-100"
            : "bg-warning-50 border-warning-100"
        }`}
      >
        <p className="text-xs font-semibold text-default-700">
          {getMinimumProductsMessage(totalProductUnits)}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-divider bg-default-50/60 p-4">
        <div className="flex justify-between items-center text-default-600">
          <span className="font-medium font-outfit">Subtotal productos</span>
          <span className="font-bold text-default-800">
            ${subtotalFormatted}
          </span>
        </div>

        <div className="flex justify-between items-center text-default-600">
          <span className="flex items-center gap-2 font-medium">
            <FaTruckFast className="text-default-400" /> Costo del servicio
          </span>
          {serviceCost === 0 && subtotal > 0 ? (
            <Chip
              className="font-black px-2"
              color="success"
              size="sm"
              variant="flat"
            >
              GRATIS
            </Chip>
          ) : (
            <span className="font-bold text-default-800">
              ${formatPrice(serviceCost)}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between border-t-2 border-dashed border-divider pt-4">
          <div>
            <span className="text-sm uppercase tracking-widest font-black text-default-400">
              Total a pagar
            </span>
            <p className="text-4xl font-black text-default-900 leading-none">
              ${formatPrice(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Button
          className={`h-14 text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95
            ${
              items.length === 0
                ? ""
                : !minimumReached
                  ? ""
                  : "bg-primary text-white hover:bg-primary-600"
            }`}
          disabled={items.length === 0 || !minimumReached}
          endContent={items.length > 0 ? <FaArrowRight /> : null}
          radius="lg"
          size="lg"
          onClick={handleCheckout}
        >
          {!minimumReached ? "Completá el mínimo" : "Continuar compra"}
        </Button>

        <Button
          as={Link}
          className="font-bold text-default-500"
          to="/products"
          variant="light"
        >
          Seguir comprando
        </Button>
      </div>
    </div>
  );
};
