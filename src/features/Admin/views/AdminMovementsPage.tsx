import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Chip,
  Button,
  Pagination,
  Spinner,
} from "@heroui/react";
import { FaArrowsRotate, FaClockRotateLeft } from "react-icons/fa6";

import { useAdminMovements } from "../hook/useAdminMovements";
import { exportAdminMovementsCsv } from "../api/movements";

import { useToast } from "@/components/ui/ToastProvider";

const STATUS_OPTIONS = [
  { key: "all", label: "Todos" },
  { key: "success", label: "Éxito" },
  { key: "info", label: "Info" },
  { key: "warning", label: "Advertencia" },
  { key: "error", label: "Error" },
];

const STATUS_COLOR: Record<
  string,
  "success" | "primary" | "warning" | "danger"
> = {
  success: "success",
  info: "primary",
  warning: "warning",
  error: "danger",
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

type QuickRangeKey = "today" | "last7" | "month" | "prevMonth" | "all";

const buildQuickRanges = () => {
  const now = new Date();
  const today = toDateInputValue(now);

  const sevenDaysAgo = new Date(now);

  sevenDaysAgo.setDate(now.getDate() - 6);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  return {
    today: {
      label: "Hoy",
      startDate: today,
      endDate: today,
    },
    last7: {
      label: "Últimos 7 días",
      startDate: toDateInputValue(sevenDaysAgo),
      endDate: today,
    },
    month: {
      label: "Este mes",
      startDate: toDateInputValue(monthStart),
      endDate: toDateInputValue(monthEnd),
    },
    prevMonth: {
      label: "Mes pasado",
      startDate: toDateInputValue(prevMonthStart),
      endDate: toDateInputValue(prevMonthEnd),
    },
    all: {
      label: "Todo",
      startDate: "",
      endDate: "",
    },
  };
};

export const AdminMovementsPage: React.FC = () => {
  const { addToast } = useToast();
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [eventFilter, setEventFilter] = useState("");
  const [actorEmail, setActorEmail] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeQuickRange, setActiveQuickRange] =
    useState<QuickRangeKey | null>("all");
  const quickRanges = useMemo(() => buildQuickRanges(), []);

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      event: eventFilter || undefined,
      module: moduleFilter || undefined,
      status: statusFilter || undefined,
      actorEmail: actorEmail || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      page,
      eventFilter,
      moduleFilter,
      statusFilter,
      actorEmail,
      startDate,
      endDate,
    ],
  );

  const { data, isLoading, refetch, isFetching } = useAdminMovements(filters);
  const items = data?.items || [];

  const onResetFilters = () => {
    setPage(1);
    setEventFilter("");
    setActorEmail("");
    setModuleFilter("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setActiveQuickRange("all");
  };

  const applyQuickRange = (rangeKey: QuickRangeKey) => {
    const range = quickRanges[rangeKey];

    setPage(1);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setActiveQuickRange(rangeKey);
  };

  const onExportCsv = async () => {
    try {
      setIsExporting(true);
      await exportAdminMovementsCsv({
        limit: 5000,
        event: eventFilter || undefined,
        module: moduleFilter || undefined,
        status: statusFilter || undefined,
        actorEmail: actorEmail || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      addToast("CSV descargado correctamente", "success");
    } catch {
      addToast("No se pudo exportar el CSV", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-5 pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px)+20px)] md:pb-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
            <FaClockRotateLeft /> Trazabilidad
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-default-900">
            Movimientos del sistema
          </h1>
          <p className="text-sm text-default-500">
            Auditoría de acciones y cambios para seguimiento operativo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="font-semibold"
            color="default"
            variant="flat"
            onPress={onResetFilters}
          >
            Limpiar filtros
          </Button>
          <Button
            className="font-semibold"
            color="primary"
            isLoading={isFetching}
            startContent={<FaArrowsRotate />}
            variant="flat"
            onPress={() => refetch()}
          >
            Actualizar
          </Button>
          <Button
            className="font-semibold"
            color="success"
            isLoading={isExporting}
            variant="flat"
            onPress={onExportCsv}
          >
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="border border-divider">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
            {(Object.keys(quickRanges) as QuickRangeKey[]).map((key) => (
              <Button
                key={key}
                className="font-semibold"
                color={activeQuickRange === key ? "primary" : "default"}
                size="sm"
                variant={activeQuickRange === key ? "solid" : "flat"}
                onPress={() => applyQuickRange(key)}
              >
                {quickRanges[key].label}
              </Button>
            ))}
          </div>
          <Input
            label="Evento"
            placeholder="order.created"
            value={eventFilter}
            onValueChange={(v) => {
              setPage(1);
              setEventFilter(v);
            }}
          />
          <Input
            label="Módulo"
            placeholder="orders / cart / auth"
            value={moduleFilter}
            onValueChange={(v) => {
              setPage(1);
              setModuleFilter(v);
            }}
          />
          <Input
            label="Usuario (email)"
            placeholder="cliente@email.com"
            value={actorEmail}
            onValueChange={(v) => {
              setPage(1);
              setActorEmail(v);
            }}
          />
          <Select
            label="Estado"
            selectedKeys={[statusFilter || "all"]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0]?.toString() || "";

              setPage(1);
              setStatusFilter(selected === "all" ? "" : selected);
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
          <Input
            label="Desde"
            type="date"
            value={startDate}
            onChange={(e) => {
              setPage(1);
              setStartDate(e.target.value);
              setActiveQuickRange(null);
            }}
          />
          <Input
            label="Hasta"
            type="date"
            value={endDate}
            onChange={(e) => {
              setPage(1);
              setEndDate(e.target.value);
              setActiveQuickRange(null);
            }}
          />
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b border-divider bg-default-50">
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Fecha
                  </th>
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Evento
                  </th>
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Estado
                  </th>
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Usuario
                  </th>
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Entidad
                  </th>
                  <th className="text-left text-xs uppercase text-default-500 px-4 py-3">
                    Ruta
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="py-12 text-center" colSpan={6}>
                      <div className="inline-flex items-center gap-2 text-default-500">
                        <Spinner color="primary" size="sm" /> Cargando
                        movimientos...
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      className="py-12 text-center text-default-400"
                      colSpan={6}
                    >
                      No hay movimientos para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  items.map((movement) => (
                    <tr
                      key={movement._id}
                      className="border-b border-divider/60"
                    >
                      <td className="px-4 py-3 text-sm text-default-600 whitespace-nowrap">
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-default-800">
                          {movement.event}
                        </p>
                        <p className="text-xs text-default-500">
                          {movement.message || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Chip
                          className="font-semibold uppercase"
                          color={STATUS_COLOR[movement.status] || "primary"}
                          size="sm"
                          variant="flat"
                        >
                          {movement.status}
                        </Chip>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="font-medium text-default-800">
                          {movement.actor?.email || "N/A"}
                        </p>
                        <p className="text-xs text-default-500">
                          {movement.actor?.role || "guest"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-default-700">
                        {movement.entity?.type
                          ? `${movement.entity.type}:${movement.entity.id}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-default-500">
                        <span className="font-semibold">
                          {movement.request?.method}
                        </span>{" "}
                        {movement.request?.path}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-xs text-default-500">
              Total: <span className="font-semibold">{data?.total || 0}</span>{" "}
              movimientos
            </p>
            <Pagination
              isCompact
              showControls
              page={data?.page || 1}
              total={data?.pages || 1}
              onChange={setPage}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
