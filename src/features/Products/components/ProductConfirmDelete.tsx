import { useDeleteProduct } from "../hooks/useDeleteProduct";

interface ProductConfirmDeleteProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export const ProductConfirmDelete = ({
  productId,
  productName,
  onClose,
}: ProductConfirmDeleteProps) => {
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    try {
      // Ejecuta la mutación de borrado
      await deleteMutation.mutateAsync(productId);
      onClose();
    } catch (error) {
      console.error("No se pudo eliminar el producto:", error);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-default-700">
        ¿Está seguro de que desea eliminar el producto{" "}
        <span className="font-semibold text-primary">{productName}</span>? Esta
        acción es irreversible.
      </p>

      {deleteMutation.isError && (
        <div className="p-3 bg-danger-50 border-l-4 border-danger text-danger rounded">
          <p className="font-bold">Error al eliminar</p>
          <p>Ocurrió un error: {deleteMutation.error.message}</p>
        </div>
      )}

      <div className="pt-4 flex justify-end space-x-3">
        <button
          className="px-4 py-2 text-sm font-medium text-default-700 bg-default-200 rounded-xl hover:bg-default-300 transition-colors"
          disabled={deleteMutation.isPending}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium text-white shadow-lg rounded-xl transition-all ${
            deleteMutation.isPending
              ? "bg-danger-300 cursor-not-allowed"
              : "bg-danger hover:bg-danger-600 shadow-danger/20 active:scale-95"
          }`}
          disabled={deleteMutation.isPending}
          type="button"
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};
