import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Skeleton,
  Spinner,
} from "@heroui/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBagShopping,
  FaBoxesStacked,
  FaChartSimple,
  FaClock,
  FaPhone,
  FaUser,
  FaWallet,
} from "react-icons/fa6";

import { useAdminCustomerDetail } from "../hook/useAdminCustomerDetail";

import { formatPrice } from "@/utils/currencyFormat";

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatHour = (date?: string | null) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const movementColor = (
  status: string,
): "success" | "primary" | "warning" | "danger" => {
  if (status === "success") return "success";
  if (status === "warning") return "warning";
  if (status === "error") return "danger";

  return "primary";
};

const SkeletonPage = () => (
  <div className="space-y-4">
    <Skeleton className="h-28 rounded-3xl" />
    <Skeleton className="h-24 rounded-3xl" />
    <Skeleton className="h-44 rounded-3xl" />
    <Skeleton className="h-56 rounded-3xl" />
  </div>
);

export const AdminCustomerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId = "" } = useParams<{ customerId: string }>();
  const [searchParams] = useSearchParams();

  const { data, isLoading, isError, isFetching } = useAdminCustomerDetail({
    customerId,
    email: searchParams.get("email") || undefined,
    firebaseUid: searchParams.get("firebaseUid") || undefined,
    name: searchParams.get("name") || undefined,
    phone: searchParams.get("phone") || undefined,
    source: searchParams.get("source") || undefined,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20">
        <div className="container mx-auto max-w-4xl px-4 py-5">
          <SkeletonPage />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border border-danger-200 bg-danger-50">
          <CardBody className="p-6 text-center text-danger-700 space-y-4">
            <p className="font-bold text-lg">No pudimos cargar este cliente</p>
            <Button
              color="danger"
              variant="flat"
              onPress={() => navigate("/admin/customers")}
            >
              Volver a clientes
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  const { customer, stats, orders, movements } = data;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-24">
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <div className="container mx-auto max-w-4xl px-4 py-5">
          <Button
            isIconOnly
            className="mb-4 bg-slate-100 dark:bg-zinc-800"
            radius="full"
            variant="flat"
            onPress={() => navigate("/admin/customers")}
          >
            <FaArrowLeft className="text-sm" />
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Admin · Detalle de Cliente
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mt-1">
                {customer.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {customer.email || "Sin email"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Chip color="primary" size="sm" variant="flat">
                  {customer.source || "interno"}
                </Chip>
                <Chip color="default" size="sm" variant="flat">
                  {customer.authProvider || "unknown"}
                </Chip>
              </div>
            </div>

            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-4 min-w-[190px]">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                Última actividad
              </p>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                {formatDate(stats.lastMovementAt || stats.lastOrderDate)}
              </p>
              <p className="text-xs text-indigo-500 mt-0.5">
                {formatHour(stats.lastMovementAt || stats.lastOrderDate)}
              </p>
            </div>
          </div>

          {customer.phone && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <FaPhone className="text-primary" />
              {customer.phone}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-5 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border border-slate-100 dark:border-zinc-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FaBagShopping /> Pedidos
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                {stats.totalOrders}
              </p>
            </CardBody>
          </Card>

          <Card className="border border-slate-100 dark:border-zinc-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FaWallet /> Facturación
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                ${formatPrice(stats.totalSpent)}
              </p>
            </CardBody>
          </Card>

          <Card className="border border-slate-100 dark:border-zinc-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FaBoxesStacked /> Productos
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                {stats.totalItems}
              </p>
            </CardBody>
          </Card>

          <Card className="border border-slate-100 dark:border-zinc-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FaChartSimple /> Ticket Promedio
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                ${formatPrice(stats.averageTicket)}
              </p>
            </CardBody>
          </Card>
        </div>

        <Card className="border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FaUser className="text-primary" /> Compras del cliente
              </h2>
              {isFetching ? <Spinner color="primary" size="sm" /> : null}
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-slate-500">
                Este cliente todavía no tiene pedidos registrados.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-100 dark:border-zinc-800 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">
                          {order.orderNumber ||
                            order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(order.orderDate)}{" "}
                          {formatHour(order.orderDate)} · {order.status}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-primary text-sm">
                          ${formatPrice(order.total)}
                        </span>
                        <Button
                          color="primary"
                          endContent={<FaArrowRight className="text-xs" />}
                          size="sm"
                          variant="flat"
                          onPress={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          Ver pedido
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-5">
            <h2 className="font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <FaClock className="text-primary" /> Movimientos relacionados
            </h2>

            {movements.length === 0 ? (
              <p className="text-sm text-slate-500">
                No hay movimientos registrados para este cliente.
              </p>
            ) : (
              <div className="space-y-3">
                {movements.map((movement) => (
                  <div
                    key={movement._id}
                    className="rounded-2xl border border-slate-100 dark:border-zinc-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">
                          {movement.event}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {movement.module} · {formatDate(movement.createdAt)}{" "}
                          {formatHour(movement.createdAt)}
                        </p>
                      </div>
                      <Chip
                        color={movementColor(movement.status)}
                        size="sm"
                        variant="flat"
                      >
                        {movement.status}
                      </Chip>
                    </div>

                    {movement.message ? (
                      <p className="text-sm text-slate-600 dark:text-zinc-300 mt-2">
                        {movement.message}
                      </p>
                    ) : null}

                    {movement.request?.path ? (
                      <>
                        <Divider className="my-2" />
                        <p className="text-xs text-slate-500">
                          {movement.request.method} {movement.request.path}
                        </p>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
};

export default AdminCustomerDetailPage;
