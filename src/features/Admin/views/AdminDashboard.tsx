import { useMemo } from "react";
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
  FaChartLine,
} from "react-icons/fa6";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/currencyFormat";

import { useProducts } from "../../Products/hooks/useProducts";
import { useAdminOrders } from "../hook/useAdminOrders";
import {
  useTopSellers,
  useTopCategorySellers,
} from "../../Products/hooks/useTopSellers";
import { LowStockTable } from "../components/LowStockTable";
import { Image } from "@heroui/react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const AdminDashboard = () => {
  const { data: response, isLoading: loadingProducts } = useProducts({});
  const { data: ordersResponse, isLoading: loadingOrders } = useAdminOrders();
  const { data: topSellers, isLoading: loadingSellers } = useTopSellers();
  const { data: topCategories, isLoading: loadingCats } =
    useTopCategorySellers();
  const orders = ordersResponse?.orders || [];

  const products = response?.data || [];

  const isLoading =
    loadingProducts || loadingOrders || loadingSellers || loadingCats;

  const dashboardData = useMemo(() => {
    if (isLoading) return null;

    const totalSales = orders.reduce(
      (sum: any, order: { total: any }) => sum + order.total,
      0,
    );

    const pendingOrders = orders.filter(
      (o: { status: string }) => o.status === "Pending",
    ).length;

    const lowStockCount = products.filter((p) => p.stock <= p.stock_min).length;

    const inventoryVal = products.reduce(
      (acc, p) => acc + p.price * p.stock,
      0,
    );

    const topProducts = topSellers
      ? topSellers.map((p) => ({
          name: p.name,
          sales: p.totalSold,
          revenue: p.revenue,
          image: p.image,
        }))
      : [];

    const categoryData = topCategories
      ? topCategories
          .slice(0, 5) // Mostramos solo top 5 para el gráfico
          .map((c) => ({
            name: c.name.toUpperCase(),
            value: c.revenue,
            sales: c.totalSold,
          }))
      : [];

    return {
      totalSales,
      pendingOrders,
      lowStockCount,
      inventoryVal,
      topProducts,
      categoryData,
    };
  }, [products, orders, isLoading]);

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Mobile skeleton header */}
        <Skeleton className="h-20 rounded-2xl md:hidden" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 md:h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 md:h-96 rounded-2xl" />
        <Skeleton className="h-72 md:h-96 rounded-2xl" />
      </div>
    );
  }

  const KPIS = [
    {
      title: "Ventas Totales",
      value: `$${formatPrice(dashboardData.totalSales)}`,
      icon: <FaDollarSign />,
      gradient: "from-emerald-400 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pendientes",
      value: dashboardData.pendingOrders,
      icon: <FaClipboardList />,
      gradient: "from-orange-400 to-amber-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Alertas Stock",
      value: dashboardData.lowStockCount,
      icon: <FaTriangleExclamation />,
      gradient: "from-red-400 to-rose-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
    },
    {
      title: "Valor Inventario",
      value: `$${formatPrice(dashboardData.inventoryVal)}`,
      icon: <FaBoxesStacked />,
      gradient: "from-blue-400 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1 uppercase tracking-widest text-xs">
            <FaChartLine /> Panel Admin
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Métricas en tiempo real de tu negocio
          </p>
        </div>

        {/* Desktop quick nav buttons */}
        <div className="hidden sm:flex gap-2">
          <Button
            as={Link}
            color="secondary"
            endContent={<FaArrowRight />}
            to="/admin/orders"
            variant="flat"
            size="sm"
          >
            Ver Órdenes
          </Button>
          <Button
            as={Link}
            color="primary"
            endContent={<FaArrowRight />}
            to="/admin/inventory"
            variant="flat"
            size="sm"
          >
            Inventario
          </Button>
        </div>

        {/* Mobile quick nav — pills */}
        <div className="flex sm:hidden gap-2 w-full">
          <Button
            as={Link}
            color="secondary"
            endContent={<FaArrowRight />}
            to="/admin/orders"
            variant="flat"
            size="sm"
            className="flex-1 text-xs"
          >
            Órdenes
          </Button>
          <Button
            as={Link}
            color="primary"
            endContent={<FaArrowRight />}
            to="/admin/inventory"
            variant="flat"
            size="sm"
            className="flex-1 text-xs"
          >
            Inventario
          </Button>
        </div>
      </motion.div>

      {/* ===== KPIs GRID — 2 cols en mobile, 4 en desktop ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        {KPIS.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-5">
                {/* Mobile layout — stacked */}
                <div className="flex flex-col gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg ${kpi.bg} ${kpi.text}`}
                  >
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
                      {kpi.title}
                    </p>
                    <h3 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white leading-tight mt-0.5 truncate">
                      {kpi.value}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ===== CHARTS — stacked en mobile, side-by-side en lg ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* TOP PRODUCTOS */}
        <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-4 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">
                🏆 Top Productos Vendidos
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="h-[200px] w-full">
                {dashboardData.topProducts.length > 0 ? (
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart
                      data={dashboardData.topProducts}
                      layout="vertical"
                      margin={{ left: 0, right: 20, top: 4, bottom: 4 }}
                    >
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" hide type="category" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar
                        barSize={18}
                        dataKey="sales"
                        fill="#6366f1"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    Sin datos de ventas aún
                  </div>
                )}
              </div>

              {/* Listado detallado */}
              <div className="space-y-3 mt-2">
                {dashboardData.topProducts.slice(0, 4).map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-700"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                        {product.image ? (
                          <Image
                            alt={product.name}
                            className="object-cover w-full h-full"
                            src={product.image}
                          />
                        ) : (
                          <FaBoxesStacked className="text-slate-400 text-xs" />
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-zinc-900">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate uppercase tracking-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {product.sales} unidades vendidas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        ${formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* DISTRIBUCIÓN CATEGORÍAS */}
        <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-4 md:p-5">
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white mb-4">
              🗂️ Distribución por Categoría
            </h3>
            <div className="h-[240px] md:h-[300px] w-full">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={dashboardData.categoryData}
                    dataKey="value"
                    fill="#8884d8"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {dashboardData.categoryData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `$${formatPrice(value)}`,
                      "Ventas",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Listado de Categorías */}
            <div className="space-y-3 mt-4">
              {dashboardData.categoryData.map((category, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase truncate max-w-[120px]">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-800 dark:text-white mr-2">
                      ${formatPrice(category.value)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {category.sales}u.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ===== ALERTAS DE STOCK ===== */}
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
        <CardBody className="p-4 md:p-5">
          <LowStockTable products={products} />
        </CardBody>
      </Card>
    </div>
  );
};
