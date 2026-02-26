import React from "react";
import { Modal, ModalContent, ModalHeader } from "@heroui/react";

import { ProductForm } from "./ProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: any | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  onSubmit,
  isLoading,
}) => {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </ModalHeader>
            {/* Renderizamos el formulario aislado */}
            <ProductForm
              initialData={editingProduct}
              isLoading={isLoading}
              onCancel={onClose}
              onSubmit={onSubmit}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
