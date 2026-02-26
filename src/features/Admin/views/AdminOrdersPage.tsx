import React, { useState } from "react";
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
} from "react-icons/fa6";

import {
  useAdminOrders,
  useUpdateAdminOrderStatus,
} from "../hook/useAdminOrders";

import { IOrder } from "@/features/Order/types/Order";

// Configuramos los estados posibles, sus colores y sus íconos
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

export const AdminOrdersPage: React.FC = () => {
  // Estados para paginación y búsqueda local
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState("");

  // Traemos los datos pasando la página actual al hook
  const { data, isLoading } = useAdminOrders(page);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAdminOrderStatus();

  // Extraemos la información del objeto paginado (con fallbacks de seguridad)
  const orders = data?.orders || [];
  const totalPages = data?.pages || 1;

  // Filtrado local en la página actual (busca por N° de orden, barrio, dirección o nombre del cliente)
  const filteredOrders = orders.filter(
    (o: IOrder) =>
      o.orderNumber?.toLowerCase().includes(filterText.toLowerCase()) ||
      o.shipping.neighborhood
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      o.shipping.address.toLowerCase().includes(filterText.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(filterText.toLowerCase()),
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

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-0 pb-10">
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FaMotorcycle className="text-emerald-500" /> Control de Entregas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona el estado de los pedidos y la logística para los
            repartidores.
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

      {/* --- TABLA DE PEDIDOS --- */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-x-auto">
        <Table
          aria-label="Tabla de gestión de entregas"
          removeWrapper
          // Agregamos la paginación en la parte inferior de la tabla
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center p-4 border-t border-slate-100 dark:border-zinc-800">
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
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>PEDIDO Y CLIENTE</TableColumn>
            <TableColumn>DESTINO</TableColumn>
            <TableColumn>HORARIO & PAGO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn align="center">ACCIÓN RÁPIDA</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No hay pedidos activos en esta página.">
            {filteredOrders.map((order: IOrder) => {
              const config =
                STATUS_MAP[order.status as keyof typeof STATUS_MAP] ||
                STATUS_MAP["Pending"];

              return (
                <TableRow
                  key={order.id}
                  className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Info del Pedido y Cliente */}
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

                  {/* Info de Destino (Barrio Privado / Dirección) */}
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

                  {/* Horario y Pago */}
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
                        ${order.total.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({order.payment.method})
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Estado Actual */}
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

                  {/* Acciones del Repartidor / Admin */}
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
                        disabledKeys={[order.status]} // Deshabilita el estado actual para que no lo vuelvan a clickear
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
