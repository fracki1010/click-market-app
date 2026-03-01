import React from "react";
import { Link, useNavigate } from "react-router";
import { Accordion, AccordionItem, Chip, Button, Spinner } from "@heroui/react";
import {
  FaBagShopping,
  FaArrowLeft,
  FaTruckFast,
  FaCircleCheck,
  FaClock,
  FaMapLocationDot,
  FaBoxOpen,
  FaMotorcycle,
  FaCheck,
  FaCalendarDays,
  FaReceipt,
  FaArrowRight,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/currencyFormat";

import { useMyOrders, useUpdateOrderStatus } from "../hook/useOrder";
import { OrderItemRow } from "../components/OrderItemRow";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();

  switch (s) {
    case "completed":
      return {
        color: "success" as const,
        icon: <FaCircleCheck />,
        label: "Entregado",
        bg: "bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
      };
    case "on way":
    case "shipped":
      return {
        color: "primary" as const,
        icon: <FaMotorcycle />,
        label: "En Camino",
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
      };
    case "processing":
    case "packed":
      return {
        color: "secondary" as const,
        icon: <FaBoxOpen />,
        label: "Preparando",
        bg: "bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
      };
    case "pending":
      return {
        color: "warning" as const,
        icon: <FaClock />,
        label: "Pendiente",
        bg: "bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
      };
    case "cancelled":
      return {
        color: "danger" as const,
        icon: null,
        label: "Cancelado",
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        color: "default" as const,
        icon: null,
        label: status,
        bg: "bg-slate-500/10",
        text: "text-slate-600 dark:text-slate-400",
      };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const OrderPage: React.FC = () => {
  const { data: orders = [], isLoading, isError } = useMyOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Spinner color="success" size="lg" />
        <p className="text-slate-500 font-bold animate-pulse">
          Cargando tus pedidos...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2rem] text-center border border-red-100 dark:border-red-900/20">
          <p className="text-red-500 font-black text-xl mb-4">
            ¡Ups! Algo salió mal
          </p>
          <Button
            variant="flat"
            color="danger"
            onPress={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );

  return (
    <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-16 pb-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-6">
            <Button
              isIconOnly
              radius="full"
              variant="flat"
              onPress={() => navigate("/products")}
              className="bg-slate-100 dark:bg-zinc-800"
            >
              <FaArrowLeft />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white">
                Mis Pedidos
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                <FaReceipt className="text-emerald-500" /> Historial de compras
                y seguimiento activo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-zinc-800 p-12"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 rounded-full scale-110" />
              <div className="relative flex items-center justify-center w-full h-full">
                <FaBagShopping className="text-6xl text-slate-300 dark:text-zinc-600" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">
              Aún no tienes pedidos
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-lg mb-8 max-w-sm mx-auto">
              Tus compras aparecerán aquí una vez que las realices. ¡Empezá hoy
              mismo!
            </p>
            <Button
              as={Link}
              className="bg-emerald-600 text-white font-black px-10 h-14 text-lg shadow-xl shadow-emerald-500/20"
              radius="full"
              to="/products"
            >
              Ir al Supermercado
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <Accordion
              className="px-0 gap-6"
              variant="splitted"
              itemClasses={{
                base: "group-[.is-splitted]:bg-white dark:group-[.is-splitted]:bg-zinc-900 group-[.is-splitted]:shadow-sm group-[.is-splitted]:rounded-[2rem] border border-slate-100 dark:border-zinc-800 overflow-hidden",
                title: "w-full",
                trigger: "px-6 py-4",
                content: "px-6 pb-6 pt-0",
              }}
            >
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);

                return (
                  <AccordionItem
                    key={order.id}
                    className="p-0 border-none shadow-none transition-all"
                    title={
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pr-2">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-2xl ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            {React.cloneElement(
                              statusConfig.icon as React.ReactElement,
                              { size: 24 },
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">
                              {order.orderNumber ||
                                `#${order.id.slice(-6).toUpperCase()}`}
                            </span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <FaCalendarDays size={10} />{" "}
                              {formatDate(order.orderDate)} •{" "}
                              {formatTime(order.orderDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-12 sm:ml-0">
                          <div className="text-right flex flex-col">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                              Total
                            </span>
                            <span className="font-black text-emerald-600 text-2xl leading-none">
                              ${formatPrice(order.total)}
                            </span>
                          </div>
                          <Chip
                            className={`font-black px-3 ${statusConfig.bg} ${statusConfig.text}`}
                            variant="flat"
                          >
                            {statusConfig.label.toUpperCase()}
                          </Chip>
                        </div>
                      </div>
                    }
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6 pt-4"
                    >
                      {/* Tracking Card */}
                      <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-[1.5rem] border border-slate-100 dark:border-zinc-800/80">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Detalles de Envío
                            </p>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm text-emerald-500">
                                <FaMapLocationDot size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-zinc-200">
                                  {order.shipping.neighborhood}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-zinc-400">
                                  {order.shipping.address}
                                </span>
                                {order.shipping.deliveryNotes && (
                                  <p className="text-xs text-slate-400 mt-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-slate-100 dark:border-zinc-700 italic">
                                    "{order.shipping.deliveryNotes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Preferencias
                            </p>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm text-orange-500">
                                <FaClock size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-zinc-200">
                                  Entrega Estimada
                                </span>
                                <span className="text-sm text-slate-500 dark:text-zinc-400">
                                  {order.shipping.deliverySlot}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm text-blue-500">
                                <FaTruckFast size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-zinc-200">
                                  Método de Pago
                                </span>
                                <span className="text-sm text-slate-500 dark:text-zinc-400">
                                  {order.payment.method === "Transfer"
                                    ? "Transferencia Bancaria"
                                    : order.payment.method}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                          Productos ({order.items.length})
                        </p>
                        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                          {order.items.map((item, idx) => (
                            <OrderItemRow
                              key={`${order.id}-${idx}`}
                              item={item}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          as={Link}
                          to={`/my-orders/${order.id}`}
                          className="flex-1 font-black"
                          color="primary"
                          radius="lg"
                          endContent={<FaArrowRight />}
                          variant="flat"
                        >
                          Ver detalle completo
                        </Button>
                        {order.status === "On Way" && (
                          <Button
                            className="flex-1 h-12 bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
                            isLoading={isUpdating}
                            radius="lg"
                            startContent={!isUpdating && <FaCheck />}
                            onPress={() =>
                              updateStatus({
                                id: order.id,
                                status: "Completed",
                              })
                            }
                          >
                            ¡Ya recibí!
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    </main>
  );
};
