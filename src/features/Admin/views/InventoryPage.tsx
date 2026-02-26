import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";

import { useProducts } from "../../Products/hooks/useProducts";
import { useCategories } from "../../Products/hooks/useCategory";
// El formulario con TanStack Form
import { InventoryTable } from "../components/InventoryTable"; // La tabla con TanStack Table
import { ProductModal } from "../components/ProductModal";
import { DeleteModal } from "../components/DeleteModal";

import { useAdminInventory } from "./../hook/useAdminInventory";

export const InventoryPage = () => {
  const { data: response } = useProducts({ limit: 4000 });
  const { data: categories = [] } = useCategories();
  const products = response?.data || [];
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
  } = useAdminInventory();

  // --- ESTADOS UI ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [filterText, setFilterText] = useState("");

  // --- LÓGICA DE BORRADO ---
  const confirmDelete = (product: any) => {
    // Aquí recibimos el producto completo desde la tabla (no solo ID)
    // O si recibes solo ID, busca el producto en la lista 'products'
    // Como tu tabla pasa ID en onDelete={handleDelete}, ajustamos aquí:

    // Si tu InventoryTable pasa ID:
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
      setDeletingProduct(null); // Cierra modal automáticamente
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Manejo de Submit (viene desde TanStack Form)
  const handleSubmit = async (values: any) => {
    // Parseo de datos numéricos seguro
    // Mapeamos los category_ids (strings) a objetos de categoría completos
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

    // Eliminamos el campo temporal de IDs si lo deseamos, aunque el API lo ignorará
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

  const tableData: any[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku || "N/A", // Valor por defecto si falta
    price: product.price,
    stock: product.stock,
    stockMin: product.stock_min, // Aquí hacemos el puente de tipos
    category:
      product.categories?.map((c) => c.name).join(", ") || "Sin categoría",
    categories: product.categories, // Mantener las categorías originales para el form
    imageUrl: product.imageUrl || "",
  }));

  // Filtrado sobre los datos transformados
  const filteredProducts = tableData.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Inventario
          </h1>
          <p className="text-gray-500">Gestión de productos y existencias</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            className="w-full sm:w-64"
            placeholder="Buscar producto..."
            startContent={<FaMagnifyingGlass className="text-gray-400" />}
            value={filterText}
            onValueChange={setFilterText}
          />
          <Button
            color="primary"
            endContent={<FaPlus />}
            onPress={openCreateModal}
          >
            Nuevo
          </Button>
        </div>
      </div>

      {/* Tabla (TanStack Table + HeroUI) */}
      <InventoryTable
        data={filteredProducts}
        onDelete={(id) => confirmDelete(id)}
        onEdit={openEditModal}
      />

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
