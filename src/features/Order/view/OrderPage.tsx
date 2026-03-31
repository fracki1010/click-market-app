import React from "react";
import { useNavigate } from "react-router";
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
  FaTriangleExclamation,
} from "react-icons/fa6";
import { motion } from "framer-motion";

import { useMyOrders, useUpdateOrderStatus } from "../hook/useOrder";
import { OrderItemRow } from "../components/OrderItemRow";

import { formatPrice } from "@/utils/currencyFormat";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();

  switch (s) {
    case "completed":
      return {
        color: "success" as const,
        icon: <FaCircleCheck />,
        label: "Entregado",
        bg: "bg-success-50",
        text: "text-success",
      };
    case "on way":
    case "shipped":
      return {
        color: "primary" as const,
        icon: <FaMotorcycle />,
        label: "En Camino",
        bg: "bg-primary-50",
        text: "text-primary",
      };
    case "processing":
    case "packed":
      return {
        color: "secondary" as const,
        icon: <FaBoxOpen />,
        label: "Preparando",
        bg: "bg-secondary-50",
        text: "text-secondary",
      };
    case "pending":
      return {
        color: "warning" as const,
        icon: <FaClock />,
        label: "Pendiente",
        bg: "bg-warning-50",
        text: "text-warning",
      };
    case "cancelled":
      return {
        color: "danger" as const,
        icon: null,
        label: "Cancelado",
        bg: "bg-danger-50",
        text: "text-danger",
      };
    default:
      return {
        color: "default" as const,
        icon: null,
        label: status,
        bg: "bg-default-100",
        text: "text-default-600",
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

  const relativeLabel = diffDays === 0 ? "hoy" : diffDays === 1 ? "mañana" : "";

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

export const OrderPage: React.FC = () => {
  const { data: orders = [], isLoading, isError } = useMyOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Spinner color="success" size="lg" />
        <p className="text-default-500 font-bold animate-pulse">
          Cargando tus pedidos...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-screen">
        <div className="bg-danger-50 p-8 rounded-[2rem] text-center border border-danger-100">
          <p className="text-danger font-black text-xl mb-4">
            ¡Ups! Algo salió mal
          </p>
          <Button
            color="danger"
            variant="flat"
            onPress={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );

  return (
    <main className="bg-background min-h-screen pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px)+var(--app-bottom-nav-buffer))] transition-colors md:pb-20">
      {/* Header Section */}
      <div className="bg-content1 border-b border-divider pt-16 pb-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-6">
            <Button
              isIconOnly
              className="bg-default-100"
              radius="full"
              variant="flat"
              onPress={() => navigate("/products")}
            >
              <FaArrowLeft />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-default-800">
                Mis Pedidos
              </h1>
              <div className="flex items-center gap-2 text-default-500 mt-2 font-medium">
                <FaReceipt className="text-success" /> Historial de compras y
                seguimiento activo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {orders.length === 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-content1 rounded-[3rem] shadow-sm border border-divider p-12"
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-default-100 rounded-full scale-110" />
              <div className="relative flex items-center justify-center w-full h-full">
                <FaBagShopping className="text-6xl text-default-300" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-default-800 mb-4">
              Aún no tienes pedidos
            </h2>
            <p className="text-default-500 text-lg mb-8 max-w-sm mx-auto">
              Tus compras aparecerán aquí una vez que las realices. ¡Empezá hoy
              mismo!
            </p>
            <Button
              className="bg-success text-white font-black px-10 h-14 text-lg shadow-xl shadow-success/20"
              radius="full"
              onPress={() => navigate("/products")}
            >
              Ir al Supermercado
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <Accordion
              className="px-0 gap-6"
              itemClasses={{
                base: "group-[.is-splitted]:bg-content1 group-[.is-splitted]:shadow-sm group-[.is-splitted]:rounded-[2rem] border border-divider overflow-hidden",
                title: "w-full",
                trigger: "px-4 sm:px-6 py-4",
                content: "px-4 sm:px-6 pb-5 sm:pb-6 pt-0",
              }}
              variant="splitted"
            >
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const delayed = isOrderDelayed(order.orderDate, order.status);
                const statusIcon = statusConfig.icon ? (
                  React.cloneElement(statusConfig.icon as React.ReactElement, {
                    size: 20,
                  })
                ) : (
                  <FaReceipt size={20} />
                );

                return (
                  <AccordionItem
                    key={order.id}
                    className="p-0 border-none shadow-none transition-all"
                    title={
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 w-full pr-1 sm:pr-2">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div
                            className={`p-2.5 sm:p-3 rounded-2xl ${statusConfig.bg} ${statusConfig.text} shrink-0`}
                          >
                            {statusIcon}
                          </div>
                          <div className="flex flex-col text-left min-w-0">
                            <span className="text-lg sm:text-xl font-black text-default-800 leading-none mb-1 truncate">
                              {order.orderNumber ||
                                `#${order.id.slice(-6).toUpperCase()}`}
                            </span>
                            <span className="text-xs font-bold text-default-400 flex items-center gap-1">
                              <FaCalendarDays size={10} />{" "}
                              {formatDate(order.orderDate)} •{" "}
                              {formatTime(order.orderDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 pl-11 sm:pl-12 md:pl-0">
                          <div className="text-left md:text-right flex flex-col">
                            <span className="text-xs font-black text-default-400 uppercase tracking-widest leading-none mb-1">
                              Total
                            </span>
                            <span className="font-black text-success text-xl sm:text-2xl leading-none">
                              ${formatPrice(order.total)}
                            </span>
                            {delayed && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-warning">
                                <FaTriangleExclamation size={10} />
                                Entrega demorada
                              </span>
                            )}
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
                      animate={{ opacity: 1 }}
                      className="space-y-6 pt-4"
                      initial={{ opacity: 0 }}
                    >
                      {/* Tracking Card */}
                      <div className="bg-default-50 p-6 rounded-[1.5rem] border border-divider">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-default-400">
                              Detalles de Envío
                            </p>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-content2 shadow-sm text-success">
                                <FaMapLocationDot size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-default-700">
                                  {order.shipping.neighborhood}
                                </span>
                                <span className="text-sm text-default-500">
                                  {order.shipping.address}
                                </span>
                                {order.shipping.deliveryNotes && (
                                  <p className="text-xs text-default-400 mt-2 bg-content2 p-2 rounded-lg border border-divider italic">
                                    "{order.shipping.deliveryNotes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-default-400">
                              Preferencias
                            </p>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-content2 shadow-sm text-warning">
                                <FaClock size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-default-700">
                                  Entrega Estimada
                                </span>
                                <span className="text-sm text-default-500">
                                  {getDeliveryDisplay(order.orderDate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-content2 shadow-sm text-primary">
                                <FaTruckFast size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-default-700">
                                  Método de Pago
                                </span>
                                <span className="text-sm text-default-500">
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-default-400 ml-2">
                          Productos ({order.items.length})
                        </p>
                        <div className="divide-y divide-divider">
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
                          className="flex-1 font-black"
                          color="primary"
                          endContent={<FaArrowRight />}
                          radius="lg"
                          variant="flat"
                          onPress={() => navigate(`/my-orders/${order.id}`)}
                        >
                          Ver detalle completo
                        </Button>
                        {order.status === "On Way" && (
                          <Button
                            className="flex-1 h-12 bg-success text-white font-black shadow-lg shadow-success/20 hover:bg-success-600 active:scale-95 transition-all"
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
