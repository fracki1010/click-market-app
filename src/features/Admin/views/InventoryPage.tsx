import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Avatar,
  Spinner,
} from "@heroui/react";
import {
  FaPlus,
  FaMagnifyingGlass,
  FaPencil,
  FaTrash,
  FaBoxesStacked,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/currencyFormat";

import { useProducts } from "../../Products/hooks/useProducts";
import { useCategories } from "../../Products/hooks/useCategory";
import { InventoryTable } from "../components/InventoryTable";
import { ProductModal } from "../components/ProductModal";
import { DeleteModal } from "../components/DeleteModal";

import { useAdminInventory } from "./../hook/useAdminInventory";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              isBordered
              radius="lg"
              src={product.imageUrl}
              fallback={<FaBoxesStacked className="text-slate-400" />}
              size="md"
              className="shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{product.sku}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {product.category}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-black text-slate-800 dark:text-white text-sm">
                ${formatPrice(product.price)}
              </span>
              <Chip color={stockColor} size="sm" variant="flat">
                {stockText} ({product.stock})
              </Chip>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Button
              className="flex-1"
              color="default"
              size="sm"
              variant="flat"
              startContent={<FaPencil className="text-xs" />}
              onPress={() => onEdit(product)}
            >
              Editar
            </Button>
            <Button
              className="flex-1"
              color="danger"
              size="sm"
              variant="flat"
              startContent={<FaTrash className="text-xs" />}
              onPress={() => onDelete(product.id)}
            >
              Eliminar
            </Button>
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
  } = useAdminInventory();

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
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-5 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
      >
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white">
            Inventario
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Gestión de productos y existencias ({filteredProducts.length})
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            className="flex-1 sm:w-64"
            placeholder="Buscar producto..."
            startContent={<FaMagnifyingGlass className="text-gray-400" />}
            value={filterText}
            onValueChange={setFilterText}
            size="sm"
          />
          <Button
            color="primary"
            endContent={<FaPlus />}
            onPress={openCreateModal}
            size="sm"
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
