import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Spinner,
  Tooltip,
  Pagination,
  Card,
  CardBody,
} from "@heroui/react";
import {
  FaMagnifyingGlass,
  FaMotorcycle,
  FaBoxOpen,
  FaCircleCheck,
  FaClock,
  FaLocationDot,
  FaMoneyBillWave,
  FaTriangleExclamation,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { formatPrice } from "@/utils/currencyFormat";

import {
  useAdminOrders,
  useUpdateAdminOrderStatus,
} from "../hook/useAdminOrders";

import { IOrder } from "@/features/Order/types/Order";

const STATUS_MAP = {
  Pending: { label: "Pendiente", color: "warning" as const, icon: <FaClock /> },
  Processing: {
    label: "Armando",
    color: "secondary" as const,
    icon: <FaBoxOpen />,
  },
  "On Way": {
    label: "En Camino",
    color: "primary" as const,
    icon: <FaMotorcycle />,
  },
  Completed: {
    label: "Entregado",
    color: "success" as const,
    icon: <FaCircleCheck />,
  },
  Cancelled: {
    label: "Cancelado",
    color: "danger" as const,
    icon: <FaTriangleExclamation />,
  },
};

// ─── Mobile Order Card ───────────────────────────────────────────────────────
const OrderCard: React.FC<{
  order: IOrder;
  onStatusChange: (id: string, status: string) => void;
  isUpdating: boolean;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ order, onStatusChange, isUpdating, navigate }) => {
  const config =
    STATUS_MAP[order.status as keyof typeof STATUS_MAP] ||
    STATUS_MAP["Pending"];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
        <CardBody className="p-4">
          {/* Row 1: Order number + status */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-black text-slate-800 dark:text-white text-base block">
                {order.orderNumber}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {order.customerName}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                {new Date(order.orderDate).toLocaleDateString()} ·{" "}
                {new Date(order.orderDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <Chip
              className="font-semibold"
              color={config.color}
              size="sm"
              startContent={config.icon}
              variant="flat"
            >
              {config.label}
            </Chip>
          </div>

          {/* Row 2: Destination */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3 mb-3 flex flex-col gap-1">
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <FaLocationDot className="text-emerald-500 text-xs shrink-0" />
              {order.shipping.neighborhood}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-4">
              {order.shipping.address}
            </span>
            {order.shipping.deliveryNotes && (
              <span className="text-xs text-orange-600 italic ml-4">
                📝 {order.shipping.deliveryNotes}
              </span>
            )}
          </div>

          {/* Row 3: Slot + total + action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Chip
                className="text-xs border border-slate-200 dark:border-zinc-700 w-fit"
                color="default"
                size="sm"
                variant="flat"
              >
                {order.shipping.deliverySlot}
              </Chip>
              <span className="text-sm font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <FaMoneyBillWave className="text-emerald-600 text-sm" />$
                {formatPrice(order.total)}{" "}
                <span className="text-xs font-normal text-slate-500">
                  ({order.payment.method})
                </span>
              </span>
            </div>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  className="font-bold"
                  color={config.color}
                  isLoading={isUpdating}
                  size="sm"
                  variant="flat"
                  endContent={<FaChevronDown className="text-xs" />}
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Opciones de estado"
                disabledKeys={[order.status]}
                onAction={(key) => onStatusChange(order.id, key as string)}
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

          {/* Botón Ver Detalle */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Button
              onPress={() => navigate(`/admin/orders/${order.id}`)}
              className="w-full font-black"
              color="primary"
              size="sm"
              variant="flat"
              endContent={<FaArrowRight className="text-xs" />}
            >
              Ver detalle completo
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const AdminOrdersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const [desktopPage, setDesktopPage] = useState(1);

  const { data, isLoading } = useAdminOrders({ page, startDate, endDate });
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAdminOrderStatus();

  const orders = data?.orders || [];
  const totalPages = data?.pages || 1;

  // Filter ONLY by text local, dates are filtered in backend
  const filteredOrders = orders.filter(
    (o: IOrder) =>
      o.orderNumber?.toLowerCase().includes(filterText.toLowerCase()) ||
      o.shipping.neighborhood
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      o.shipping.address.toLowerCase().includes(filterText.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(filterText.toLowerCase()),
  );

  useEffect(() => {
    setDesktopPage(1);
  }, [filterText, orders]);

  const itemsPerPageDesktop = 5;
  const desktopTotalPages = Math.ceil(
    filteredOrders.length / itemsPerPageDesktop,
  );
  const paginatedDesktopOrders = filteredOrders.slice(
    (desktopPage - 1) * itemsPerPageDesktop,
    desktopPage * itemsPerPageDesktop,
  );

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  if (isLoading && !data) {
    return (
      <div className="flex h-[80vh] justify-center items-center">
        <Spinner
          color="success"
          label="Cargando rutas de entrega..."
          size="lg"
        />
      </div>
    );
  }

  // Pre-set filters functions

  const setToday = () => {
    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const today = todayDate.toISOString().split("T")[0];
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    setStartDate(yesterday);
    setEndDate(today);
    setPage(1);
  };

  const setThisMonth = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
    setPage(1);
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto pb-10">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <FaMotorcycle className="text-emerald-500" /> Control de Entregas
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Gestiona el estado de los pedidos y la logística.
            </p>
          </div>
          <Input
            className="w-full sm:w-80"
            color="success"
            placeholder="Buscar cliente, barrio, N°..."
            startContent={<FaMagnifyingGlass className="text-slate-400" />}
            value={filterText}
            variant="bordered"
            onValueChange={setFilterText}
          />
        </div>

        {/* Date Filters Container */}
        <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <Input
            type="date"
            label="Desde"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            size="sm"
            className="w-full sm:w-40"
            variant="faded"
          />
          <Input
            type="date"
            label="Hasta"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            size="sm"
            className="w-full sm:w-40"
            variant="faded"
          />

          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button size="sm" variant="flat" color="primary" onPress={setToday}>
              Hoy
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              onPress={setThisMonth}
            >
              Mes
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={clearDates}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE: Cards ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-slate-400 py-12 text-sm">
            No hay pedidos activos.
          </div>
        ) : (
          filteredOrders.map((order: IOrder) => (
            <OrderCard
              key={order.id}
              isUpdating={isUpdating}
              order={order}
              onStatusChange={handleStatusChange}
              navigate={navigate}
            />
          ))
        )}

        {totalPages > 1 && (
          <div className="flex w-full justify-center pt-2">
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={page}
              total={totalPages}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-x-auto">
        <Table
          aria-label="Tabla de gestión de entregas"
          removeWrapper
          bottomContent={
            desktopTotalPages > 1 ? (
              <div className="flex w-full justify-center p-4 border-t border-slate-100 dark:border-zinc-800">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="success"
                  page={desktopPage}
                  total={desktopTotalPages}
                  onChange={(newPage) => setDesktopPage(newPage)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>PEDIDO Y CLIENTE</TableColumn>
            <TableColumn>DESTINO</TableColumn>
            <TableColumn>HORARIO & PAGO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn align="center">ACCIÓN RÁPIDA</TableColumn>
            <TableColumn align="center">DETALLE</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No hay pedidos activos en esta página.">
            {paginatedDesktopOrders.map((order: IOrder) => {
              const config =
                STATUS_MAP[order.status as keyof typeof STATUS_MAP] ||
                STATUS_MAP["Pending"];

              return (
                <TableRow
                  key={order.id}
                  className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-white text-base">
                        {order.orderNumber}
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {new Date(order.orderDate).toLocaleDateString()} -{" "}
                        {new Date(order.orderDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col max-w-xs">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <FaLocationDot className="text-emerald-500 text-xs shrink-0" />
                        {order.shipping.neighborhood}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-4">
                        {order.shipping.address}
                      </span>
                      {order.shipping.deliveryNotes && (
                        <Tooltip
                          color="warning"
                          content={order.shipping.deliveryNotes}
                          placement="right"
                        >
                          <span className="text-xs text-orange-600 font-medium truncate mt-1 cursor-help italic ml-4">
                            Nota: {order.shipping.deliveryNotes}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1.5 items-start">
                      <Chip
                        className="text-xs font-medium border border-slate-200 dark:border-zinc-700"
                        color="default"
                        size="sm"
                        variant="flat"
                      >
                        {order.shipping.deliverySlot}
                      </Chip>
                      <span className="text-sm font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <FaMoneyBillWave className="text-emerald-600 text-base" />
                        ${formatPrice(order.total)}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({order.payment.method})
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Chip
                      className="font-semibold px-2"
                      color={config.color}
                      size="sm"
                      startContent={config.icon}
                      variant="flat"
                    >
                      {config.label}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          className="font-bold text-white min-w-[120px]"
                          color={config.color}
                          isLoading={isUpdating}
                          size="sm"
                          variant="flat"
                        >
                          Cambiar Estado
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Opciones de estado"
                        disabledKeys={[order.status]}
                        onAction={(key) =>
                          handleStatusChange(order.id, key as string)
                        }
                      >
                        <DropdownItem
                          key="Pending"
                          startContent={<FaClock className="text-warning" />}
                        >
                          Volver a Pendiente
                        </DropdownItem>
                        <DropdownItem
                          key="Processing"
                          startContent={
                            <FaBoxOpen className="text-secondary" />
                          }
                        >
                          Armando pedido
                        </DropdownItem>
                        <DropdownItem
                          key="On Way"
                          className="font-semibold"
                          startContent={
                            <FaMotorcycle className="text-primary" />
                          }
                        >
                          Sale para entrega
                        </DropdownItem>
                        <DropdownItem
                          key="Completed"
                          className="text-success font-bold"
                          color="success"
                          startContent={
                            <FaCircleCheck className="text-success" />
                          }
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
                  </TableCell>

                  {/* Detalle link */}
                  <TableCell>
                    <Button
                      onPress={() => navigate(`/admin/orders/${order.id}`)}
                      color="primary"
                      size="sm"
                      variant="light"
                      isIconOnly
                    >
                      <FaArrowRight className="text-sm" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
