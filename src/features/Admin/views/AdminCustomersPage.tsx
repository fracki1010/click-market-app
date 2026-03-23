import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Spinner,
} from "@heroui/react";
import {
  FaArrowRight,
  FaBox,
  FaClock,
  FaMagnifyingGlass,
  FaPhone,
  FaUsers,
  FaDatabase,
  FaCloudArrowUp,
} from "react-icons/fa6";
import { useNavigate } from "react-router";

import { useAdminAllOrders } from "../hook/useAdminOrders";
import { useAdminCustomers } from "../hook/useAdminCustomers";
import { formatPrice } from "@/utils/currencyFormat";
import { IOrder } from "@/features/Order/types/Order";

type CustomerOrderGroup = {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: string;
  authProvider: string;
  orders: IOrder[];
  ordersCount: number;
  totalSpent: number;
  totalItems: number;
  lastOrderDate: string | null;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const formatHour = (date: string) =>
  new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const AdminCustomersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } =
    useAdminAllOrders();
  const {
    data: customersData,
    isLoading: customersLoading,
    isError: customersError,
  } = useAdminCustomers(search);
  const customerDirectory = customersData?.items || [];

  const customers = useMemo(() => {
    const grouped = new Map<string, CustomerOrderGroup>();

    for (const order of orders) {
      const userId = order.userId || "sin-id";
      const existing = grouped.get(userId);

      if (!existing) {
        grouped.set(userId, {
          userId,
          customerName: order.customerName || "Cliente sin nombre",
          customerEmail: "",
          customerPhone: order.customerPhone || "Sin teléfono",
          source: "orders",
          authProvider: "unknown",
          orders: [order],
          ordersCount: 1,
          totalSpent: order.total,
          totalItems: order.items.reduce((acc, item) => acc + item.quantity, 0),
          lastOrderDate: order.orderDate,
        });
        continue;
      }

      existing.orders.push(order);
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      existing.totalItems += order.items.reduce((acc, item) => acc + item.quantity, 0);
      if (
        !existing.lastOrderDate ||
        new Date(order.orderDate).getTime() >
          new Date(existing.lastOrderDate).getTime()
      ) {
        existing.lastOrderDate = order.orderDate;
      }
    }

    for (const customer of customerDirectory) {
      const key =
        customer.userId ||
        `firebase:${customer.firebaseUid || customer.email || customer.name}`;
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          userId: key,
          customerName: customer.name || "Cliente sin nombre",
          customerEmail: customer.email || "",
          customerPhone: customer.phone || "Sin teléfono",
          source: customer.source || "unknown",
          authProvider: customer.authProvider || "unknown",
          orders: [],
          ordersCount: 0,
          totalSpent: 0,
          totalItems: 0,
          lastOrderDate: customer.createdAt || null,
        });
        continue;
      }

      if (!existing.customerEmail && customer.email) {
        existing.customerEmail = customer.email;
      }
      if (
        (!existing.customerPhone || existing.customerPhone === "Sin teléfono") &&
        customer.phone
      ) {
        existing.customerPhone = customer.phone;
      }
      if (
        (!existing.customerName || existing.customerName === "Cliente sin nombre") &&
        customer.name
      ) {
        existing.customerName = customer.name;
      }
      if (customer.source) existing.source = customer.source;
      if (customer.authProvider) existing.authProvider = customer.authProvider;
    }

    return [...grouped.values()]
      .map((customer) => ({
        ...customer,
        orders: customer.orders.sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.lastOrderDate || 0).getTime() -
          new Date(a.lastOrderDate || 0).getTime(),
      );
  }, [orders, customerDirectory]);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return customers;

    return customers.filter((customer) => {
      const byName = customer.customerName.toLowerCase().includes(value);
      const byEmail = customer.customerEmail.toLowerCase().includes(value);
      const byPhone = customer.customerPhone.toLowerCase().includes(value);
      const bySource = customer.source.toLowerCase().includes(value);
      const byOrder = customer.orders.some((order) =>
        order.orderNumber?.toLowerCase().includes(value),
      );

      return byName || byEmail || byPhone || bySource || byOrder;
    });
  }, [customers, search]);

  const totalRevenue = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    [filteredCustomers],
  );

  const totalOrders = useMemo(
    () => filteredCustomers.reduce((sum, customer) => sum + customer.ordersCount, 0),
    [filteredCustomers],
  );

  const isLoading = ordersLoading || customersLoading;
  const isError = ordersError || customersError;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] justify-center items-center">
        <Spinner color="primary" label="Cargando historial de clientes..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="border border-danger-200 bg-danger-50">
          <CardBody className="p-5 text-danger-700">
            No se pudo cargar el historial de clientes.
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto pb-10">
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
        <CardBody className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <FaUsers className="text-primary" /> Clientes y Compras
                </h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Vista agrupada por cliente para revisar su historial completo.
                </p>
              </div>

              <Input
                className="w-full sm:w-80"
                color="primary"
                placeholder="Buscar por cliente, email, teléfono o N° de pedido"
                startContent={<FaMagnifyingGlass className="text-slate-400" />}
                value={search}
                variant="bordered"
                onValueChange={setSearch}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="border border-slate-100 dark:border-zinc-800 shadow-none">
                <CardBody className="p-4">
                  <p className="text-xs text-slate-500">Clientes</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {filteredCustomers.length}
                  </p>
                </CardBody>
              </Card>
              <Card className="border border-slate-100 dark:border-zinc-800 shadow-none">
                <CardBody className="p-4">
                  <p className="text-xs text-slate-500">Pedidos</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {totalOrders}
                  </p>
                </CardBody>
              </Card>
              <Card className="border border-slate-100 dark:border-zinc-800 shadow-none">
                <CardBody className="p-4">
                  <p className="text-xs text-slate-500">Facturación</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    ${formatPrice(totalRevenue)}
                  </p>
                </CardBody>
              </Card>
            </div>
            {customersData?.firebaseSyncWarning && (
              <Card className="border border-warning-200 bg-warning-50 shadow-none">
                <CardBody className="p-3 text-warning-700 text-xs">
                  {customersData.firebaseSyncWarning}
                </CardBody>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>

      {filteredCustomers.length === 0 ? (
        <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-8 text-center text-slate-500">
            No encontramos clientes con ese filtro.
          </CardBody>
        </Card>
      ) : (
        <Accordion variant="splitted" itemClasses={{ base: "border border-slate-100 dark:border-zinc-800 shadow-sm" }}>
          {filteredCustomers.map((customer) => (
            <AccordionItem
              key={customer.userId}
              title={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-white">
                    {customer.customerName}
                  </span>
                  {customer.customerEmail && (
                    <Chip size="sm" variant="flat" color="default">
                      {customer.customerEmail}
                    </Chip>
                  )}
                  <Chip size="sm" variant="flat" color="default">
                    {customer.ordersCount} pedidos
                  </Chip>
                  <Chip size="sm" variant="flat" color="success">
                    ${formatPrice(customer.totalSpent)}
                  </Chip>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={customer.source === "google" ? "primary" : "secondary"}
                    startContent={
                      customer.source === "google" ? (
                        <FaCloudArrowUp />
                      ) : (
                        <FaDatabase />
                      )
                    }
                  >
                    {customer.source}
                  </Chip>
                </div>
              }
              subtitle={
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <FaPhone /> {customer.customerPhone || "Sin teléfono"}
                  </span>
                  {customer.lastOrderDate && (
                    <span className="inline-flex items-center gap-1">
                      <FaClock /> Última compra {formatDate(customer.lastOrderDate)}{" "}
                      {formatHour(customer.lastOrderDate)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <FaBox /> {customer.totalItems} productos
                  </span>
                </div>
              }
            >
              <div className="flex flex-col gap-3 pb-1">
                {customer.orders.length === 0 && (
                  <Card className="border border-slate-100 dark:border-zinc-800 shadow-none">
                    <CardBody className="p-4 text-sm text-slate-500">
                      Este cliente aún no tiene pedidos registrados.
                    </CardBody>
                  </Card>
                )}
                {customer.orders.map((order) => (
                  <Card key={order.id} className="border border-slate-100 dark:border-zinc-800 shadow-none">
                    <CardBody className="p-4 flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            Pedido {order.orderNumber}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(order.orderDate)} {formatHour(order.orderDate)} · {order.status}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-primary">
                          Total: ${formatPrice(order.total)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${item.productId}-${idx}`}
                            className="rounded-xl border border-slate-100 dark:border-zinc-800 p-2.5 text-sm"
                          >
                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.quantity} x ${formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          endContent={<FaArrowRight className="text-xs" />}
                          onPress={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          Ver detalle del pedido
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
