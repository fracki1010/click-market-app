import React from "react";
import { useParams, useNavigate } from "react-router";
import {
  Button,
  Chip,
  Skeleton,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
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
  FaUser,
  FaChevronDown,
  FaPhone,
  FaFilePdf,
} from "react-icons/fa6";
import { motion } from "framer-motion";

import {
  useAdminOrderById,
  useUpdateAdminOrderStatus,
  useOrderInvoice,
} from "../hook/useAdminOrders";
import { IOrderItem } from "@/features/Order/types/Order";
import { formatPrice } from "@/utils/currencyFormat";

// ─── Configuración de estados ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    label: "Pendiente",
    color: "warning" as const,
    icon: <FaClock />,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    step: 1,
  },
  Processing: {
    label: "Armando",
    color: "secondary" as const,
    icon: <FaBoxOpen />,
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    step: 2,
  },
  "On Way": {
    label: "En Camino",
    color: "primary" as const,
    icon: <FaMotorcycle />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    step: 3,
  },
  Completed: {
    label: "Entregado",
    color: "success" as const,
    icon: <FaCircleCheck />,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    step: 4,
  },
  Cancelled: {
    label: "Cancelado",
    color: "danger" as const,
    icon: <FaTriangleExclamation />,
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    step: 0,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("es-AR", {
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 rounded-3xl" />
    <Skeleton className="h-48 rounded-3xl" />
    <Skeleton className="h-40 rounded-3xl" />
    <Skeleton className="h-32 rounded-3xl" />
    <Skeleton className="h-20 rounded-3xl" />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useAdminOrderById(id ?? "");

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAdminOrderStatus();
  const { mutate: downloadInvoice, isPending: isDownloading } =
    useOrderInvoice();

  const handleStatusChange = (newStatus: string) => {
    if (!order) return;
    updateStatus({ id: order.id, status: newStatus });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
        <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 py-5 mb-5">
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
            No se pudo cargar esta orden.
          </p>
          <Button
            color="primary"
            variant="flat"
            radius="lg"
            onPress={() => navigate("/admin/orders")}
          >
            Volver a órdenes
          </Button>
        </div>
      </main>
    );
  }

  const statusConfig =
    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG["Pending"];

  return (
    <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-28">
      {/* ── Hero header ── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-2xl px-4 pt-5 pb-6">
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            className="mb-4 bg-slate-100 dark:bg-zinc-800"
            onPress={() => navigate("/admin/orders")}
          >
            <FaArrowLeft className="text-sm" />
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Admin · Detalle de Orden
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

          <div className="mt-6">
            <Button
              className="bg-emerald-600 text-white font-black w-full sm:w-auto"
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
        {/* ── Datos del Cliente ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-indigo-500" />
            <h2 className="font-black text-slate-800 dark:text-white text-base">
              Cliente
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
              <FaUser className="text-indigo-500 text-base" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">
                {order.customerName || "Cliente"}
              </p>
              {order.customerPhone && (
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {order.customerPhone}
                  </p>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    radius="full"
                    className="h-6 w-6 min-w-0"
                    onPress={() =>
                      (window.location.href = `tel:${order.customerPhone}`)
                    }
                  >
                    <FaPhone size={10} />
                  </Button>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                ID: {order.userId}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Cambio de Estado (acción principal admin) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            Cambiar Estado del Pedido
          </p>

          {/* Estado actual */}
          <div className="flex items-center justify-between gap-4">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 ${statusConfig.bg}`}
            >
              <span className={`text-xl ${statusConfig.text}`}>
                {statusConfig.icon}
              </span>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Estado actual
                </p>
                <p className={`font-black text-sm ${statusConfig.text}`}>
                  {statusConfig.label}
                </p>
              </div>
            </div>

            {/* Dropdown para cambiar */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  color={statusConfig.color}
                  isLoading={isUpdating}
                  radius="lg"
                  variant="flat"
                  endContent={
                    !isUpdating && <FaChevronDown className="text-xs" />
                  }
                  className="font-black shrink-0"
                >
                  Cambiar
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Cambiar estado de la orden"
                disabledKeys={[order.status]}
                onAction={(key) => handleStatusChange(key as string)}
              >
                <DropdownItem
                  key="Pending"
                  startContent={<FaClock className="text-warning" />}
                >
                  Volver a Pendiente
                </DropdownItem>
                <DropdownItem
                  key="Processing"
                  startContent={<FaBoxOpen className="text-secondary" />}
                >
                  Armando pedido
                </DropdownItem>
                <DropdownItem
                  key="On Way"
                  className="font-semibold"
                  startContent={<FaMotorcycle className="text-primary" />}
                >
                  Sale para entrega
                </DropdownItem>
                <DropdownItem
                  key="Completed"
                  className="text-success font-bold"
                  color="success"
                  startContent={<FaCircleCheck className="text-success" />}
                >
                  Marcar como Entregado
                </DropdownItem>
                <DropdownItem
                  key="Cancelled"
                  className="text-danger"
                  color="danger"
                  startContent={<FaTriangleExclamation />}
                >
                  Cancelar / No entregado
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </motion.div>

        {/* ── Productos ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden"
        >
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

          <div className="divide-y divide-slate-50 dark:divide-zinc-800/60">
            {order.items.map((item: IOrderItem, idx: number) => (
              <div
                key={`${order.id}-${idx}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                {/* Imagen */}
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

                {/* Subtotal */}
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
          transition={{ delay: 0.16 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaReceipt className="text-emerald-500" />
            <h2 className="font-black text-slate-800 dark:text-white text-base">
              Resumen de Pago
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-zinc-400">
                Subtotal productos
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                ${order.subtotal ?? order.total - (order.shippingPrice ?? 0)}
              </span>
            </div>

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

            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-800 dark:text-white">
                Total
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                ${formatPrice(order.total)}
              </span>
            </div>

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

        {/* ── Datos de envío / dirección ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaLocationDot className="text-blue-500" />
            <h2 className="font-black text-slate-800 dark:text-white text-base">
              Datos de Entrega
            </h2>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Barrio / Zona
                </span>
                <span className="font-bold text-slate-700 dark:text-zinc-200 text-sm">
                  {order.shipping.neighborhood}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Franja Horaria
                </span>
                <div className="flex items-center gap-1">
                  <FaClock className="text-orange-400 text-xs shrink-0" />
                  <span className="font-semibold text-slate-600 dark:text-zinc-300 text-sm">
                    {order.shipping.deliverySlot}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Dirección completa
              </span>
              <span className="font-semibold text-slate-600 dark:text-zinc-300 text-sm">
                {order.shipping.address}
              </span>
            </div>

            {order.shipping.deliveryNotes && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-1">
                  📝 Notas de repartidor
                </span>
                <p className="text-sm text-amber-700 dark:text-amber-400 italic">
                  "{order.shipping.deliveryNotes}"
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Volver ── */}
        <Button
          variant="flat"
          color="default"
          radius="lg"
          className="w-full"
          startContent={<FaArrowLeft className="text-xs" />}
          onPress={() => navigate("/admin/orders")}
        >
          Volver a Control de Entregas
        </Button>
      </div>
    </main>
  );
};
