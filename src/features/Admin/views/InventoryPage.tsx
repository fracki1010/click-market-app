import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Avatar,
  Spinner,
  Progress,
} from "@heroui/react";
import {
  FaPlus,
  FaMagnifyingGlass,
  FaPencil,
  FaTrash,
  FaBoxesStacked,
  FaEye,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

import { useProducts } from "../../Products/hooks/useProducts";
import { useCategories } from "../../Products/hooks/useCategory";
import { InventoryTable } from "../components/InventoryTable";
import { ProductModal } from "../components/ProductModal";
import { DeleteModal } from "../components/DeleteModal";

import { useAdminInventory } from "./../hook/useAdminInventory";

import { formatPrice } from "@/utils/currencyFormat";

// ─── Mobile Product Card ─────────────────────────────────────────────────────
type MobileProductCardProps = {
  product: any;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
};

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  let stockColor: "success" | "warning" | "danger" = "success";
  let stockText = "Normal";

  if (product.stock === 0) {
    stockColor = "danger";
    stockText = "Agotado";
  } else if (product.stock <= product.stockMin) {
    stockColor = "warning";
    stockText = "Bajo";
  }

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer"
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      onClick={() => navigate(`/admin/inventory/${product.id}`)}
    >
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 active:scale-[0.98] transition-all">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              isBordered
              className="shrink-0"
              fallback={<FaBoxesStacked className="text-slate-400" />}
              radius="lg"
              size="md"
              src={product.imageUrl}
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{product.sku}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded-md">
                  Costo: ${formatPrice(product.costPrice)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-black text-teal-600 dark:text-teal-400 text-sm">
                ${formatPrice(product.price)}
              </span>
              <Chip color={stockColor} size="sm" variant="flat">
                {stockText} (x{product.stock})
              </Chip>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Button
              className="flex-1"
              color="primary"
              size="sm"
              startContent={<FaEye className="text-xs" />}
              variant="flat"
              onPress={() => navigate(`/admin/inventory/${product.id}`)}
            >
              Ver
            </Button>
            <Button
              className="flex-1"
              color="default"
              size="sm"
              startContent={<FaPencil className="text-xs" />}
              variant="flat"
              onClick={(e: any) => {
                e.stopPropagation();
                onEdit(product);
              }}
            >
              Editar
            </Button>
            <Button
              className="min-w-0 px-3"
              color="danger"
              size="sm"
              startContent={<FaTrash className="text-xs" />}
              variant="flat"
              onClick={(e: any) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
            />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const InventoryPage = () => {
  const { data: response, isLoading } = useProducts({ limit: 4000 });
  const { data: categories = [] } = useCategories();
  const products = response?.data || [];
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    markup,
    updateMarkupMutation,
    markupProgress,
  } = useAdminInventory();

  const [markupValue, setMarkupValue] = useState(markup.toString());

  // Sincronizar markup cuando carga la data
  useEffect(() => {
    setMarkupValue(markup.toString());
  }, [markup]);

  const handleUpdateMarkup = () => {
    if (Number(markupValue) !== markup) {
      updateMarkupMutation.mutate(Number(markupValue));
    }
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [filterText, setFilterText] = useState("");

  // Infinite Scroll State
  const [visibleItems, setVisibleItems] = useState(15);
  const observerTarget = useRef(null);

  const confirmDelete = (product: any) => {
    const productToDelete = products.find((p) => p.id === product);

    setDeletingProduct(productToDelete);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    const selectedCategories = (values.category_ids || [])
      .map((id: string) => {
        const found = categories.find((c) => c.id.toString() === id.toString());

        return found ? { id: found.id, name: found.name } : null;
      })
      .filter(Boolean);

    const payload = {
      ...values,
      price: Number(values.price),
      costPrice: Number(values.costPrice || 0),
      stock_current: Number(values.stock_current),
      stock_min: Number(values.stock_min),
      categories: selectedCategories,
      rating: editingProduct?.rating || 0,
    };

    delete payload.category_ids;

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: payload });
      } else {
        await createProduct(payload);
      }
      setIsFormModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const tableData: any[] = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku || "N/A",
        costPrice: product.costPrice,
        price: product.price,
        stock: product.stock,
        stockMin: product.stock_min,
        category:
          product.categories?.map((c: any) => c.name).join(", ") ||
          "Sin categoría",
        categories: product.categories,
        imageUrl: product.imageUrl || "",
      })),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return tableData.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [tableData, filterText]);

  // Reset scroll on search
  useEffect(() => {
    setVisibleItems(15);
  }, [filterText]);

  // Infinite Scroll Observer logic
  const loadMore = useCallback(() => {
    if (visibleItems < filteredProducts.length) {
      // Simulate/Trigger load more
      setVisibleItems((prev) => prev + 15);
    }
  }, [visibleItems, filteredProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const mobileProductsToShow = useMemo(() => {
    return filteredProducts.slice(0, visibleItems);
  }, [filteredProducts, visibleItems]);

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4 md:px-0">
      {/* ── Header ── */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-5 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
        initial={{ opacity: 0, y: -8 }}
      >
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white">
            Inventario
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Gestión de productos y existencias ({filteredProducts.length})
          </p>
          <div className="flex items-center gap-2 mt-3 bg-indigo-50/50 dark:bg-indigo-900/10 p-2 px-3 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30 w-fit">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Margen Ganancia
            </span>
            <div className="flex items-center gap-1">
              <Input
                className="w-16"
                classNames={{
                  input: "text-center font-black",
                  inputWrapper: "bg-transparent h-6 min-h-unit-6 px-1",
                }}
                endContent={
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                    %
                  </span>
                }
                size="sm"
                type="number"
                value={markupValue}
                variant="flat"
                onBlur={handleUpdateMarkup}
                onValueChange={setMarkupValue}
              />
            </div>
            {updateMarkupMutation.isPending && (
              <Spinner className="ml-1" size="sm" />
            )}
          </div>

          {/* BARRA DE PROGRESO */}
          <AnimatePresence>
            {markupProgress?.status === "running" && (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 w-full max-w-md"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">
                    Actualizando Precios...
                  </span>
                  <span className="text-[10px] font-black text-slate-500">
                    {markupProgress.processed} / {markupProgress.total}
                  </span>
                </div>
                <Progress
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-indigo-500 to-teal-400",
                  }}
                  radius="sm"
                  size="sm"
                  value={
                    (markupProgress.processed / markupProgress.total) * 100
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            className="flex-1 sm:w-64"
            placeholder="Buscar producto..."
            size="sm"
            startContent={<FaMagnifyingGlass className="text-gray-400" />}
            value={filterText}
            onValueChange={setFilterText}
          />
          <Button
            color="primary"
            endContent={<FaPlus />}
            size="sm"
            onPress={openCreateModal}
          >
            Nuevo
          </Button>
        </div>
      </motion.div>

      {/* ── MOBILE: Infinite Scroll ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="h-32 animate-pulse bg-slate-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-slate-400 py-12 text-sm">
            No hay productos en inventario.
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {mobileProductsToShow.map((product) => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  onDelete={confirmDelete}
                  onEdit={openEditModal}
                />
              ))}
            </AnimatePresence>

            {/* Target element for IntersectionObserver */}
            {visibleItems < filteredProducts.length && (
              <div ref={observerTarget} className="flex justify-center p-6">
                <Spinner color="primary" label="Cargando más..." size="sm" />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden md:block">
        <InventoryTable
          data={filteredProducts}
          onDelete={(id) => confirmDelete(id)}
          onEdit={openEditModal}
        />
      </div>

      <ProductModal
        editingProduct={editingProduct}
        isLoading={isCreating || isUpdating}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={!!deletingProduct}
        productName={deletingProduct?.name}
        onClose={() => setDeletingProduct(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
};
