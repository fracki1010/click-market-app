import React, { useMemo, useState } from "react";
import { Button, Chip, Input, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaArrowLeft,
  FaBasketShopping,
  FaCalendarDay,
  FaCalendarDays,
  FaFileArrowDown,
} from "react-icons/fa6";

import { useAdminAllOrders } from "../hook/useAdminOrders";
import { formatPrice } from "@/utils/currencyFormat";

const SHOPPING_RELEVANT_STATUSES = new Set(["Pending", "Processing"]);

export const AdminShoppingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: allOrders = [], isLoading } = useAdminAllOrders({
    startDate,
    endDate,
  });

  const shoppingSummary = useMemo(() => {
    const activeOrders = allOrders.filter((order) =>
      SHOPPING_RELEVANT_STATUSES.has(order.status),
    );

    const grouped = new Map<
      string,
      {
        productId: string;
        name: string;
        totalQuantity: number;
        estimatedCost: number;
        orderIds: Set<string>;
      }
    >();

    for (const order of activeOrders) {
      for (const item of order.items) {
        const productId = item.productId || item.product?.id || item.product?.name;
        const productName = item.product?.name || "Producto sin nombre";

        if (!productId) continue;

        if (!grouped.has(productId)) {
          grouped.set(productId, {
            productId,
            name: productName,
            totalQuantity: 0,
            estimatedCost: 0,
            orderIds: new Set<string>(),
          });
        }

        const current = grouped.get(productId);
        if (!current) continue;

        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);

        current.totalQuantity += quantity;
        current.estimatedCost += quantity * price;
        current.orderIds.add(order.id);
      }
    }

    const items = Array.from(grouped.values())
      .map(({ orderIds, ...rest }) => ({
        ...rest,
        ordersCount: orderIds.size,
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    return {
      items,
      activeOrdersCount: activeOrders.length,
      uniqueProductsCount: items.length,
      totalUnits: items.reduce((sum, item) => sum + item.totalQuantity, 0),
      totalEstimatedCost: items.reduce((sum, item) => sum + item.estimatedCost, 0),
    };
  }, [allOrders]);

  const downloadShoppingListCsv = () => {
    if (!shoppingSummary.items.length) return;

    const escapeCsv = (value: string | number) => {
      const raw = String(value ?? "");
      return `"${raw.replace(/"/g, '""')}"`;
    };

    const now = new Date();
    const dateLabel = now.toLocaleDateString("es-AR");
    const timeLabel = now.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const rows = [
      ["Click Market - Lista total a comprar", "", "", ""],
      ["Generado", `${dateLabel} ${timeLabel}`, "", ""],
      ["Pedidos activos", shoppingSummary.activeOrdersCount, "", ""],
      ["Productos distintos", shoppingSummary.uniqueProductsCount, "", ""],
      ["Unidades totales", shoppingSummary.totalUnits, "", ""],
      ["", "", "", ""],
      ["Producto", "Cantidad", "Pedidos", "Costo estimado"],
      ...shoppingSummary.items.map((item) => [
        item.name,
        item.totalQuantity,
        item.ordersCount,
        item.estimatedCost,
      ]),
      ["", "", "", ""],
      ["TOTAL", shoppingSummary.totalUnits, "", shoppingSummary.totalEstimatedCost],
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileDate = now.toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `lista-compra-${fileDate}.csv`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const setToday = () => {
    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const today = todayDate.toISOString().split("T")[0];
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    setStartDate(yesterday);
    setEndDate(today);
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
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto pb-10">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <FaBasketShopping className="text-secondary" /> Lista de Compras
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Resumen total para salir a comprar por todos los pedidos activos.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="light"
              startContent={<FaArrowLeft />}
              onPress={() => navigate("/admin/orders")}
            >
              Volver a Entregas
            </Button>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<FaFileArrowDown />}
              isDisabled={isLoading || shoppingSummary.items.length === 0}
              onPress={downloadShoppingListCsv}
            >
              Descargar Excel (CSV)
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <Input
            type="date"
            label="Desde"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="sm"
            className="w-full sm:w-40"
            variant="faded"
          />
          <Input
            type="date"
            label="Hasta"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="sm"
            className="w-full sm:w-40"
            variant="faded"
          />
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<FaCalendarDay />}
              onPress={setToday}
            >
              Hoy
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              startContent={<FaCalendarDays />}
              onPress={setThisMonth}
            >
              Mes
            </Button>
            <Button size="sm" variant="light" color="danger" onPress={clearDates}>
              Limpiar
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
      >
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Chip color="secondary" variant="flat" className="font-semibold w-fit">
            {shoppingSummary.activeOrdersCount} pedidos activos
          </Chip>
          <Chip color="default" variant="flat" className="font-semibold w-fit">
            {shoppingSummary.uniqueProductsCount} productos
          </Chip>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <Spinner size="sm" color="secondary" />
            Calculando productos a comprar...
          </div>
        ) : shoppingSummary.items.length === 0 ? (
          <div className="text-sm text-slate-500 bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
            No hay pedidos Pendiente/Armando para preparar compras.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Productos distintos</p>
                <p className="font-black text-slate-800 dark:text-white">
                  {shoppingSummary.uniqueProductsCount}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Unidades a comprar</p>
                <p className="font-black text-slate-800 dark:text-white">
                  {shoppingSummary.totalUnits}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Costo estimado</p>
                <p className="font-black text-slate-800 dark:text-white">
                  ${formatPrice(shoppingSummary.totalEstimatedCost)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-zinc-800/60 px-3 py-2 text-[11px] md:text-xs font-black text-slate-500 uppercase tracking-wide">
                <span className="col-span-6">Producto</span>
                <span className="col-span-2 text-center">Cantidad</span>
                <span className="col-span-2 text-center">Pedidos</span>
                <span className="col-span-2 text-right">Costo</span>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {shoppingSummary.items.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-12 items-center px-3 py-2 border-t border-slate-100 dark:border-zinc-800 text-sm"
                  >
                    <span className="col-span-6 font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">
                      {item.name}
                    </span>
                    <span className="col-span-2 text-center font-bold text-slate-800 dark:text-white">
                      {item.totalQuantity}
                    </span>
                    <span className="col-span-2 text-center text-slate-600 dark:text-slate-300">
                      {item.ordersCount}
                    </span>
                    <span className="col-span-2 text-right font-semibold text-slate-700 dark:text-slate-200">
                      ${formatPrice(item.estimatedCost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
