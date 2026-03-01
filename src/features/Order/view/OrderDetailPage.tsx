import React from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button, Chip, Skeleton, Divider } from "@heroui/react";
import {
  FaArrowLeft,
  FaLocationDot,
  FaClock,
  FaMoneyBillWave,
  FaBoxOpen,
  FaMotorcycle,
  FaCircleCheck,
  FaTriangleExclamation,
  FaReceipt,
  FaBagShopping,
  FaTruck,
  FaCheck,
} from "react-icons/fa6";
import { motion } from "framer-motion";

import { useOrderById, useUpdateOrderStatus } from "../hook/useOrder";
import { IOrderItem } from "../types/Order";
import { formatPrice } from "@/utils/currencyFormat";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "completed":
      return {
        color: "success" as const,
        icon: <FaCircleCheck />,
        label: "Entregado",
        gradient: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-400",
        step: 4,
      };
    case "on way":
    case "shipped":
      return {
        color: "primary" as const,
        icon: <FaMotorcycle />,
        label: "En Camino",
        gradient: "from-blue-400 to-indigo-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        step: 3,
      };
    case "processing":
    case "packed":
      return {
        color: "secondary" as const,
        icon: <FaBoxOpen />,
        label: "Preparando",
        gradient: "from-violet-400 to-purple-500",
        bg: "bg-violet-50 dark:bg-violet-900/20",
        text: "text-violet-600 dark:text-violet-400",
        step: 2,
      };
    case "pending":
      return {
        color: "warning" as const,
        icon: <FaClock />,
        label: "Pendiente",
        gradient: "from-amber-400 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-400",
        step: 1,
      };
    case "cancelled":
      return {
        color: "danger" as const,
        icon: <FaTriangleExclamation />,
        label: "Cancelado",
        gradient: "from-red-400 to-rose-500",
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
        step: 0,
      };
    default:
      return {
        color: "default" as const,
        icon: <FaReceipt />,
        label: status,
        gradient: "from-slate-400 to-slate-500",
        bg: "bg-slate-50 dark:bg-slate-900/20",
        text: "text-slate-600 dark:text-slate-400",
        step: 1,
      };
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const paymentLabel = (method: string) => {
  switch (method) {
    case "Cash":
      return "Efectivo";
    case "Card":
      return "Tarjeta";
    case "Transfer":
      return "Transferencia";
    default:
      return method;
  }
};

// ─── Timeline de estado ───────────────────────────────────────────────────────
const STEPS = [
  { label: "Pendiente", icon: <FaClock /> },
  { label: "Preparando", icon: <FaBoxOpen /> },
  { label: "En Camino", icon: <FaMotorcycle /> },
  { label: "Entregado", icon: <FaCircleCheck /> },
];

const StatusTimeline: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-between w-full relative">
    {/* barra de progreso */}
    <div className="absolute left-0 right-0 top-[18px] h-1 bg-slate-100 dark:bg-zinc-800 z-0 mx-6" />
    <div
      className="absolute left-0 top-[18px] h-1 bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-500 z-10 transition-all duration-700 mx-6"
      style={{
        width:
          currentStep === 0
            ? "0%"
            : `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
      }}
    />
    {STEPS.map((step, idx) => {
      const done = currentStep > idx;
      const active = currentStep === idx + 1;
      return (
        <div
          key={idx}
          className="flex flex-col items-center gap-1.5 z-20 flex-1"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300 border-2
              ${
                done || active
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-400"
              }`}
          >
            {done || active ? (
              done ? (
                <FaCheck className="text-xs" />
              ) : (
                step.icon
              )
            ) : (
              step.icon
            )}
          </div>
          <span
            className={`text-[10px] font-bold text-center leading-tight ${
              done || active
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400 dark:text-zinc-500"
            }`}
          >
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <Skeleton className="h-32 rounded-3xl" />
    <Skeleton className="h-24 rounded-3xl" />
    <Skeleton className="h-48 rounded-3xl" />
    <Skeleton className="h-40 rounded-3xl" />
    <Skeleton className="h-32 rounded-3xl" />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrderById(id ?? "");
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
        <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-6 pb-6 mb-6">
          <div className="container mx-auto max-w-2xl px-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
        </div>
        <div className="container mx-auto max-w-2xl px-4">
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  // ── Error ──
  if (isError || !order) {
    return (
      <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen flex items-center justify-center pb-24">
        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 max-w-sm mx-4">
          <FaTriangleExclamation className="text-4xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            Orden no encontrada
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            No pudimos cargar los detalles de esta orden.
          </p>
          <Button
            as={Link}
            to="/my-orders"
            color="primary"
            variant="flat"
            radius="lg"
          >
            Ver mis pedidos
          </Button>
        </div>
      </main>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled";

  return (
    <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-28">
      {/* ── Hero header ── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-2xl px-4 pt-5 pb-6">
          {/* Back button */}
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            className="mb-4 bg-slate-100 dark:bg-zinc-800"
            onPress={() => navigate("/my-orders")}
          >
            <FaArrowLeft className="text-sm" />
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                Detalle de Pedido
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                {order.orderNumber || `#${order.id.slice(-6).toUpperCase()}`}
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 capitalize">
                {formatDate(order.orderDate)} · {formatTime(order.orderDate)}
              </p>
            </div>
            <Chip
              className={`font-black text-sm px-3 py-1 ${statusConfig.bg} ${statusConfig.text} shrink-0 mt-1`}
              startContent={statusConfig.icon}
              variant="flat"
              color={statusConfig.color}
            >
              {statusConfig.label}
            </Chip>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-5 space-y-4">
        {/* ── Timeline de progreso (solo si no cancelado) ── */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              Estado del Pedido
            </p>
            <StatusTimeline currentStep={statusConfig.step} />
          </motion.div>
        )}

        {/* ── Productos ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-50 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FaBagShopping className="text-indigo-500" />
              <h2 className="font-black text-slate-800 dark:text-white text-base">
                Productos
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-full">
              {order.items.length} {order.items.length === 1 ? "ítem" : "ítems"}
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-50 dark:divide-zinc-800/60">
            {order.items.map((item: IOrderItem, idx: number) => (
              <div
                key={`${order.id}-${idx}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                {/* Image */}
                <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                      <FaBoxOpen size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-lg">
                      x{item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ${formatPrice(item.price)} c/u
                    </span>
                  </div>
                </div>

                {/* Subtotal item */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase text-slate-300 dark:text-zinc-600 tracking-tight">
                    Subtotal
                  </p>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    ${formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Resumen de precios ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaReceipt className="text-emerald-500" />
            <h2 className="font-black text-slate-800 dark:text-white text-base">
              Resumen de Pago
            </h2>
          </div>

          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-zinc-400">
                Subtotal productos
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                ${order.subtotal ?? order.total - (order.shippingPrice ?? 0)}
              </span>
            </div>

            {/* Envío */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
                <FaTruck className="text-xs" />
                Costo de envío
              </div>
              <span
                className={`text-sm font-bold ${
                  order.shippingPrice === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-700 dark:text-zinc-200"
                }`}
              >
                {order.shippingPrice === 0
                  ? "🎉 Gratis"
                  : `$${formatPrice(order.shippingPrice)}`}
              </span>
            </div>

            <Divider className="my-1 bg-slate-100 dark:bg-zinc-800" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-800 dark:text-white">
                Total
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                ${formatPrice(order.total)}
              </span>
            </div>

            {/* Método de pago */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
                <FaMoneyBillWave className="text-xs" />
                Método de pago
              </div>
              <Chip
                color="default"
                size="sm"
                variant="flat"
                className="text-xs font-bold"
              >
                {paymentLabel(order.payment.method)}
              </Chip>
            </div>
          </div>
        </motion.div>

        {/* ── Datos de envío ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaLocationDot className="text-blue-500" />
            <h2 className="font-black text-slate-800 dark:text-white text-base">
              Datos de Entrega
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Barrio / Zona
              </span>
              <span className="font-bold text-slate-700 dark:text-zinc-200">
                {order.shipping.neighborhood}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Dirección
              </span>
              <span className="font-semibold text-slate-600 dark:text-zinc-300 text-sm">
                {order.shipping.address}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Franja Horaria
              </span>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-orange-400 text-xs" />
                <span className="font-semibold text-slate-600 dark:text-zinc-300 text-sm">
                  {order.shipping.deliverySlot}
                </span>
              </div>
            </div>

            {order.shipping.deliveryNotes && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-1">
                  Notas de entrega
                </span>
                <p className="text-sm text-amber-700 dark:text-amber-400 italic">
                  "{order.shipping.deliveryNotes}"
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── CTA confirmar recepción ── */}
        {order.status === "On Way" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              className="w-full h-14 bg-emerald-600 text-white font-black text-base shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 active:scale-95 transition-all"
              isLoading={isUpdating}
              radius="lg"
              startContent={!isUpdating && <FaCheck />}
              onPress={() =>
                updateStatus({ id: order.id, status: "Completed" })
              }
            >
              ¡Ya recibí mi pedido!
            </Button>
          </motion.div>
        )}

        {/* ── Volver ── */}
        <Button
          as={Link}
          to="/my-orders"
          variant="flat"
          color="default"
          radius="lg"
          className="w-full"
          startContent={<FaArrowLeft className="text-xs" />}
        >
          Volver a mis pedidos
        </Button>
      </div>
    </main>
  );
};
