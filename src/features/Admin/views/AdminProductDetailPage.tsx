import React from "react";
import { useParams, useNavigate } from "react-router";
import {
  Button,
  Chip,
  Skeleton,
  Card,
  CardBody,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiPackage,
  FiTag,
  FiBarChart2,
  FiLayers,
} from "react-icons/fi";
import { motion } from "framer-motion";

import { useProduct } from "../../Products/hooks/useProduct";
import { formatPrice } from "@/utils/currencyFormat";
import { useAdminInventory } from "../hook/useAdminInventory";
import { ProductModal } from "../components/ProductModal";

export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id || "");
  const { deleteProduct, updateProduct, isUpdating } = useAdminInventory();

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/3 aspect-square rounded-2xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Button onPress={() => navigate("/admin/inventory")}>
          Volver al Inventario
        </Button>
      </div>
    );
  }

  const p = Number(product.price);
  const c = Number(product.costPrice);
  const profit = (isNaN(p) ? 0 : p) - (isNaN(c) ? 0 : c);
  const margin = c > 0 ? (profit / c) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* HEADER & BREADCRUMBS */}
      <div className="py-6 space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem onPress={() => navigate("/admin/dashboard")}>
            Panel
          </BreadcrumbItem>
          <BreadcrumbItem onPress={() => navigate("/admin/inventory")}>
            Inventario
          </BreadcrumbItem>
          <BreadcrumbItem className="font-bold text-indigo-600">
            Detalle de Producto
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="flat"
              onPress={() => navigate("/admin/inventory")}
            >
              <FiArrowLeft />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                {product.name}
              </h1>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                SKU: {product.sku || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-indigo-600 text-white font-bold"
              startContent={<FiEdit3 />}
              onPress={() => setIsEditModalOpen(true)}
            >
              Editar Producto
            </Button>
            <Button
              color="danger"
              variant="flat"
              isIconOnly
              onPress={async () => {
                if (confirm("¿Estás seguro de eliminar este producto?")) {
                  await deleteProduct(product.id);
                  navigate("/admin/inventory");
                }
              }}
            >
              <FiTrash2 />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LADO IZQUIERDO: IMAGEN Y CATEGORÍAS */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden rounded-[2.5rem]">
            <CardBody className="p-0">
              <div className="aspect-square bg-slate-50 dark:bg-zinc-800 flex items-center justify-center p-8">
                <img
                  src={
                    product.imageUrl ||
                    "https://placehold.co/400?text=Sin+Imagen"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </CardBody>
          </Card>

          <Card className="border-none shadow-lg shadow-slate-100 dark:shadow-none bg-white dark:bg-zinc-900 rounded-3xl">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FiLayers className="text-indigo-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Categorías
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat) => (
                  <Chip
                    key={cat.id}
                    color="secondary"
                    variant="flat"
                    className="font-bold"
                  >
                    {cat.name}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* LADO DERECHO: DATOS Y MÉTRICAS */}
        <div className="lg:col-span-2 space-y-6">
          {/* CARDS DE PRECIOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <FiTag size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Precio Costo
                  </span>
                </div>
                <p className="text-3xl font-black text-indigo-900 dark:text-indigo-100">
                  ${formatPrice(product.costPrice)}
                </p>
              </CardBody>
            </Card>

            <Card className="border-none bg-teal-50/50 dark:bg-teal-900/10 rounded-3xl">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
                  <FiBarChart2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Precio Venta
                  </span>
                </div>
                <p className="text-3xl font-black text-teal-900 dark:text-teal-100">
                  ${formatPrice(product.price)}
                </p>
              </CardBody>
            </Card>

            <Card className="border-none bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                  <FiPackage size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Stock Actual
                  </span>
                </div>
                <p className="text-3xl font-black text-amber-900 dark:text-amber-100">
                  {product.stock}
                </p>
                <p className="text-[10px] font-bold text-amber-600 uppercase mt-1">
                  Mínimo: {product.stock_min}
                </p>
              </CardBody>
            </Card>
          </div>

          {/* CUADRO DE GANANCIA PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-[2rem] border-2 shadow-2xl ${
              profit >= 0
                ? "bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400 text-white"
                : "bg-red-600 border-red-400 text-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">
                  Dashboard de Ganancia
                </h3>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black tracking-tighter">
                    ${formatPrice(profit)}
                  </span>
                  <span className="text-xl font-bold opacity-90">
                    +{margin.toFixed(1)}% de margen
                  </span>
                </div>
              </div>
              <div className="hidden md:block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                  Status
                </p>
                <Chip className="font-bold bg-white text-indigo-700">
                  Saludable
                </Chip>
              </div>
            </div>
          </motion.div>

          {/* DESCRIPCIÓN */}
          <Card className="border-none shadow-lg shadow-slate-100 dark:shadow-none bg-white dark:bg-zinc-900 rounded-3xl p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Descripción
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description ||
                  "Sin descripción disponible para este producto."}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingProduct={product}
        isLoading={isUpdating}
        onSubmit={async (data) => {
          await updateProduct({ id: product.id, ...data });
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
};
