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
  FaFilePdf,
} from "react-icons/fa6";
import { motion } from "framer-motion";

import { useOrderById, useUpdateOrderStatus } from "../hook/useOrder";
import { useOrderInvoice } from "../../Admin/hook/useAdminOrders";
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
        gradient: "from-success to-success-600",
        bg: "bg-success-50",
        text: "text-success",
        step: 4,
      };
    case "on way":
    case "shipped":
      return {
        color: "primary" as const,
        icon: <FaMotorcycle />,
        label: "En Camino",
        gradient: "from-primary to-primary-600",
        bg: "bg-primary-50",
        text: "text-primary",
        step: 3,
      };
    case "processing":
    case "packed":
      return {
        color: "secondary" as const,
        icon: <FaBoxOpen />,
        label: "Preparando",
        gradient: "from-secondary to-secondary-600",
        bg: "bg-secondary-50",
        text: "text-secondary",
        step: 2,
      };
    case "pending":
      return {
        color: "warning" as const,
        icon: <FaClock />,
        label: "Pendiente",
        gradient: "from-warning to-warning-600",
        bg: "bg-warning-50",
        text: "text-warning",
        step: 1,
      };
    case "cancelled":
      return {
        color: "danger" as const,
        icon: <FaTriangleExclamation />,
        label: "Cancelado",
        gradient: "from-danger to-danger-600",
        bg: "bg-danger-50",
        text: "text-danger",
        step: 0,
      };
    default:
      return {
        color: "default" as const,
        icon: <FaReceipt />,
        label: status,
        gradient: "from-default-400 to-default-600",
        bg: "bg-default-50",
        text: "text-default-600",
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

const formatPriceFixed = (value: number, digits = 2) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(safeValue);
};

const getDeliveryDisplay = (orderDate: string) => {
  const scheduledDate = new Date(orderDate);
  scheduledDate.setDate(scheduledDate.getDate() + 1);

  const scheduledStart = new Date(scheduledDate);
  scheduledStart.setHours(0, 0, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (scheduledStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  const relativeLabel =
    diffDays === 0 ? "hoy" : diffDays === 1 ? "mañana" : "";

  const exactDate = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(scheduledDate);

  return `${exactDate}${relativeLabel ? ` (${relativeLabel})` : ""} · 16:00 - 20:00`;
};

const isOrderDelayed = (orderDate: string, status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "completed" || normalizedStatus === "cancelled") {
    return false;
  }

  const createdAt = new Date(orderDate);
  const deadline = new Date(createdAt);
  deadline.setDate(deadline.getDate() + 1);
  deadline.setHours(20, 0, 0, 0);

  return new Date() > deadline;
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
    <div className="absolute left-0 right-0 top-[18px] h-1 bg-divider z-0 mx-6" />
    <div
      className="absolute left-0 top-[18px] h-1 bg-gradient-to-r from-warning via-primary to-success z-10 transition-all duration-700 mx-6"
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
                  ? "bg-success border-success text-white shadow-lg shadow-success/20"
                  : "bg-content1 border-divider text-default-400"
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
              done || active ? "text-success" : "text-default-400"
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
  const { mutate: downloadInvoice, isPending: isDownloading } =
    useOrderInvoice();

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="bg-background min-h-screen pb-24 transition-colors">
        <div className="bg-content1 border-b border-divider pt-6 pb-6 mb-6">
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
      <main className="bg-background min-h-screen flex items-center justify-center pb-24 transition-colors">
        <div className="text-center p-8 bg-content1 rounded-3xl shadow-sm border border-divider max-w-sm mx-4">
          <FaTriangleExclamation className="text-4xl text-danger mx-auto mb-4" />
          <h2 className="text-xl font-black text-default-800 mb-2">
            Orden no encontrada
          </h2>
          <p className="text-default-500 text-sm mb-6">
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
  const subtotalValue = order.subtotal ?? order.total - (order.serviceCost ?? 0);
  const delayed = isOrderDelayed(order.orderDate, order.status);

  return (
    <main className="bg-background min-h-screen pb-28 transition-colors">
      {/* ── Hero header ── */}
      <div className="bg-content1 border-b border-divider">
        <div className="container mx-auto max-w-2xl px-4 pt-5 pb-6">
          {/* Back button */}
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            className="mb-4 bg-default-100"
            onPress={() => navigate("/my-orders")}
          >
            <FaArrowLeft className="text-sm" />
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-default-400 mb-1">
                Detalle de Pedido
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-default-800 leading-tight">
                {order.orderNumber || `#${order.id.slice(-6).toUpperCase()}`}
              </h1>
              <p className="text-sm text-default-500 mt-1 capitalize">
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
          {delayed && (
            <div className="mt-3">
              <Chip
                color="warning"
                variant="flat"
                className="font-bold"
                startContent={<FaTriangleExclamation />}
              >
                Entrega demorada
              </Chip>
            </div>
          )}

          <div className="mt-6">
            <Button
              className="bg-success text-white font-black w-full sm:w-auto"
              radius="lg"
              startContent={<FaFilePdf />}
              isLoading={isDownloading}
              onPress={() => downloadInvoice(order.id)}
            >
              Descargar Factura PDF
            </Button>
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
            className="bg-content1 rounded-3xl shadow-sm border border-divider p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-default-400 mb-5">
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
          className="bg-content1 rounded-3xl shadow-sm border border-divider overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-divider">
            <div className="flex items-center gap-2">
              <FaBagShopping className="text-primary" />
              <h2 className="font-black text-default-800 text-base">
                Productos
              </h2>
            </div>
            <span className="text-xs font-bold text-default-400 bg-default-50 px-2 py-1 rounded-full">
              {order.items.length} {order.items.length === 1 ? "ítem" : "ítems"}
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-divider">
            {order.items.map((item: IOrderItem, idx: number) => (
              <div
                key={`${order.id}-${idx}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                {/* Image */}
                <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-default-50 border border-divider">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-default-300">
                      <FaBoxOpen size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-default-800 text-sm leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-black text-primary bg-primary-50 px-2 py-0.5 rounded-lg">
                      x{item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-default-400">
                      ${formatPrice(item.price)} c/u
                    </span>
                  </div>
                </div>

                {/* Subtotal item */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase text-default-300 tracking-tight">
                    Subtotal
                  </p>
                  <p className="text-base font-black text-default-900">
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
          className="bg-content1 rounded-3xl shadow-sm border border-divider p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaReceipt className="text-success" />
            <h2 className="font-black text-default-800 text-base">
              Resumen de Pago
            </h2>
          </div>

          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">
                Subtotal productos
              </span>
              <span className="text-sm font-bold text-default-700">
                ${formatPriceFixed(subtotalValue, 2)}
              </span>
            </div>

            {/* Envío */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-default-500">
                <FaTruck className="text-xs" />
                Costo del servicio
              </div>
              <span
                className={`text-sm font-bold ${
                  order.serviceCost === 0
                    ? "text-success"
                    : "text-default-700"
                }`}
              >
                {order.serviceCost === 0
                  ? "🎉 Gratis"
                  : `$${formatPrice(order.serviceCost)}`}
              </span>
            </div>

            <Divider className="my-1 bg-divider" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-default-800">
                Total
              </span>
              <span className="text-xl font-black text-success">
                ${formatPrice(order.total)}
              </span>
            </div>

            {/* Método de pago */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 text-xs text-default-400">
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
          className="bg-content1 rounded-3xl shadow-sm border border-divider p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaLocationDot className="text-primary" />
            <h2 className="font-black text-default-800 text-base">
              Datos de Entrega
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-default-400">
                Barrio / Zona
              </span>
              <span className="font-bold text-default-700">
                {order.shipping.neighborhood}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-default-400">
                Dirección
              </span>
              <span className="font-semibold text-default-600 text-sm">
                {order.shipping.address}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-default-400">
                Franja Horaria
              </span>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-warning text-xs" />
                <span className="font-semibold text-default-600 text-sm">
                  {getDeliveryDisplay(order.orderDate)}
                </span>
              </div>
            </div>

            {order.shipping.deliveryNotes && (
              <div className="bg-warning-50 border border-warning-100 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-warning block mb-1">
                  Notas de entrega
                </span>
                <p className="text-sm text-warning-700 dark:text-warning-400 italic">
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
              className="w-full h-14 bg-success text-white font-black text-base shadow-xl shadow-success/30 hover:bg-success-700 active:scale-95 transition-all"
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
