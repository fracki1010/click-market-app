import React, { useMemo } from "react";
import { Card, CardBody, Button, Skeleton } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaDollarSign,
  FaClipboardList,
  FaTriangleExclamation,
  FaBoxesStacked,
  FaArrowRight,
} from "react-icons/fa6";
import { Link } from "react-router";

import { useProducts } from "../../Products/hooks/useProducts";
import { useAdminOrders } from "../hook/useAdminOrders";
import { LowStockTable } from "../components/LowStockTable";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const AdminDashboard = () => {
  const { data: response, isLoading: loadingProducts } = useProducts({});
  const { data: orders = [], isLoading: loadingOrders } = useAdminOrders();

  const products = response?.data || [];

  const isLoading = loadingProducts || loadingOrders;

  const dashboardData = useMemo(() => {
    if (isLoading) return null;

    // KPI 1: Ventas Totales
    const totalSales = orders.reduce(
      (sum: any, order: { total: any }) => sum + order.total,
      0,
    );

    // KPI 2: Órdenes Pendientes
    const pendingOrders = orders.filter(
      (o: { status: string }) => o.status === "Pending",
    ).length;

    // KPI 3: Stock Bajo
    const lowStockCount = products.filter((p) => p.stock <= p.stock_min).length;

    // KPI 4: Valor Inventario
    const inventoryVal = products.reduce(
      (acc, p) => acc + p.price * p.stock,
      0,
    );

    // GRÁFICO 1: TOP 5 PRODUCTOS VENDIDOS
    // Mapa para sumar cantidades por nombre de producto
    const productSalesMap: Record<string, number> = {};
    orders.forEach((order: { items: any[] }) => {
      order.items.forEach(
        (item: { product: { name: any }; quantity: number }) => {
          const name = item.product.name;
          productSalesMap[name] = (productSalesMap[name] || 0) + item.quantity;
        },
      );
    });

    // Convertir a array, ordenar y tomar top 5
    const topProducts = Object.entries(productSalesMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // GRÁFICO 2: DISTRIBUCIÓN POR CATEGORÍA
    const categoryMap: Record<string, number> = {};
    products.forEach((p) => {
      const catName = p.category || "Sin Categoría";
      categoryMap[catName] = (categoryMap[catName] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalSales,
      pendingOrders,
      lowStockCount,
      inventoryVal,
      topProducts,
      categoryData,
    };
  }, [products, orders, isLoading]);

  // Si carga, mostramos esqueletos bonitos
  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  // Configuración de Tarjetas KPI
  const KPIS = [
    {
      title: "Ventas Totales",
      value: `$${dashboardData.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <FaDollarSign />,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Órdenes Pendientes",
      value: dashboardData.pendingOrders,
      icon: <FaClipboardList />,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
    {
      title: "Alertas Stock",
      value: dashboardData.lowStockCount,
      icon: <FaTriangleExclamation />,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      title: "Valor Inventario",
      value: `$${dashboardData.inventoryVal.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      icon: <FaBoxesStacked />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-500">Métricas en tiempo real de tu negocio</p>
        </div>
        <Button
          as={Link}
          to="/admin/inventory"
          color="primary"
          variant="flat"
          endContent={<FaArrowRight />}
        >
          Gestionar Inventario
        </Button>
      </div>

      {/* SECCIÓN DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {KPIS.map((kpi, idx) => (
          <Card
            key={idx}
            className="shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className={`p-4 rounded-xl text-2xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {kpi.value}
                </h3>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* GRÁFICO TOP PRODUCTOS */}
        <Card className="p-4 shadow-sm">
          <h3 className="text-lg font-bold mb-4 px-2">
            Top Productos Más Vendidos
          </h3>
          <div className="h-[300px] w-full">
            {dashboardData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.topProducts}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                  style={{ color: "blue" }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Sin datos de ventas aún
              </div>
            )}
          </div>
        </Card>

        {/* GRÁFICO DISTRIBUCIÓN */}
        <Card className="p-4 shadow-sm">
          <h3 className="text-lg font-bold mb-4 px-2">
            Distribución por Categoría
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* TABLA DE ALERTAS */}
      <Card className="shadow-sm">
        <div className="p-4">
          <LowStockTable products={products} />
        </div>
      </Card>
    </div>
  );
};
