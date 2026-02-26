import React from "react";
import { Link } from "react-router";
import {
  Accordion,
  AccordionItem,
  Chip,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
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
} from "react-icons/fa6";

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
      };
    case "on way":
    case "shipped":
      return {
        color: "primary" as const,
        icon: <FaMotorcycle />,
        label: "En Camino",
      };
    case "processing":
    case "packed":
      return {
        color: "secondary" as const,
        icon: <FaBoxOpen />,
        label: "Preparando",
      };
    case "pending":
      return {
        color: "warning" as const,
        icon: <FaClock />,
        label: "Pendiente",
      };
    case "cancelled":
      return { color: "danger" as const, icon: null, label: "Cancelado" };
    default:
      return { color: "default" as const, icon: null, label: status };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const OrderPage: React.FC = () => {
  const { data: orders = [], isLoading, isError } = useMyOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="success" size="lg" />
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar órdenes
      </div>
    );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button
          isIconOnly
          as={Link}
          radius="full"
          to="/products"
          variant="light"
        >
          <FaArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Mis Pedidos
          </h1>
          <p className="text-slate-500">Historial de compras y seguimiento</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-dashed border-slate-300">
          <FaBagShopping className="mx-auto text-6xl text-slate-200 mb-4" />
          <h2 className="text-xl font-semibold text-slate-600">
            No tienes pedidos aún
          </h2>
          <Button
            as={Link}
            className="mt-4 font-bold text-white"
            color="success"
            to="/products"
          >
            Ir al Click Market
          </Button>
        </div>
      ) : (
        <Accordion className="px-0" variant="splitted">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);

            return (
              <AccordionItem
                key={order.id}
                aria-label={`Orden ${order.orderNumber}`}
                className="bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 rounded-xl mb-4 group-[.is-splitted]:px-4 group-[.is-splitted]:bg-white"
                title={
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full pr-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {order.orderNumber || `Pedido #${order.id.slice(-6)}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-600 text-lg">
                        ${order.total.toFixed(2)}
                      </span>
                      <Chip
                        className="capitalize"
                        color={statusConfig.color}
                        startContent={statusConfig.icon}
                        variant="flat"
                      >
                        {statusConfig.label}
                      </Chip>
                    </div>
                  </div>
                }
              >
                <div className="py-2">
                  {/* Detalles de Envío */}
                  <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <FaMapLocationDot className="text-emerald-500" /> Envío
                        a:
                      </p>
                      <p className="text-slate-600 ml-6">
                        {order.shipping.neighborhood} - {order.shipping.address}
                      </p>
                      {order.shipping.deliveryNotes && (
                        <p className="text-slate-400 text-xs ml-6 mt-1 italic">
                          {`Nota: ${order.shipping.deliveryNotes}`}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <FaClock className="text-emerald-500" /> Horario:
                      </p>
                      <p className="text-slate-600 ml-6">
                        {order.shipping.deliverySlot}
                      </p>
                      <p className="font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300 mt-2">
                        <FaTruckFast className="text-emerald-500" /> Estado:
                      </p>
                      <p className="text-slate-600 ml-6">
                        {statusConfig.label}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Productos */}
                  <div className="space-y-1 mb-4">
                    {order.items.map((item, idx) => (
                      <OrderItemRow key={`${order.id}-${idx}`} item={item} />
                    ))}
                  </div>

                  <Divider className="my-4" />

                  {/* Footer de la tarjeta con acción */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-500">
                      Pago:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {order.payment.method === "Transfer"
                          ? "Transferencia"
                          : order.payment.method}
                      </span>
                    </div>

                    {order.status === "On Way" && (
                      <Button
                        className="text-white font-bold animate-pulse"
                        color="success"
                        isLoading={isUpdating}
                        startContent={!isUpdating && <FaCheck />}
                        variant="shadow"
                        onPress={() =>
                          updateStatus({ id: order.id, status: "Completed" })
                        }
                      >
                        ¡Ya recibí mi pedido!
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};
