import type { IProduct } from "../types/Product";

import { useState } from "react";
import { FaCartPlus, FaStar } from "react-icons/fa6";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/react";
import { motion } from "framer-motion";

import { useCart } from "../../Cart/hooks/useCart";
import { useAuth } from "../../Auth/hooks/useAuth";
import { Modal } from "../../../components/layout/Modal";
import { useToast } from "../../../components/ui/ToastProvider";

import { ProductConfirmDelete } from "./ProductConfirmDelete";
import { ProductEdit } from "./ProductEdit";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const onAdd = async () => {
    setIsAdding(true);
    await addItem(product, 1);
    addToast(`${product.name} agregado al carrito`, "success");
    setIsAdding(false);
  };

  // Simulate a discount or check if it has one
  const hasDiscount = product.price > 1000; // Placeholder logic
  const originalPrice = product.price * 1.2;

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 dark:border-neutral-700 flex flex-col h-full transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-neutral-900">
          <img
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={product.imageUrl}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Chip
              className="font-bold text-[9px] h-5 shadow-sm"
              color="primary"
              size="sm"
              variant="solid"
            >
              NUEVO
            </Chip>
            {hasDiscount && (
              <Chip
                className="font-bold text-[9px] h-5 shadow-sm"
                color="secondary"
                size="sm"
                variant="flat"
              >
                OFERTA
              </Chip>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug h-9 mb-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center text-amber-400">
                <FaStar size={10} />
              </div>
              <span className="text-[10px] text-gray-400 font-bold">
                4.9 (45)
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              {hasDiscount && (
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  ${originalPrice.toLocaleString("es-AR")}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  ${product.price.toLocaleString("es-AR")}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] font-bold text-green-500">
                    15% OFF
                  </span>
                )}
              </div>
            </div>

            <p className="text-[10px] font-bold text-green-600 dark:text-green-400 mt-1">
              Llega gratis mañana
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              fullWidth
              className="font-black text-[12px] h-10 shadow-lg shadow-indigo-100 dark:shadow-none bg-indigo-600 hover:bg-indigo-700 text-white"
              color="primary"
              disabled={user?.role === "ADMIN"}
              isLoading={isAdding}
              radius="full"
              startContent={!isAdding && <FaCartPlus className="text-sm" />}
              onPress={onAdd}
            >
              {isAdding ? "Agregando..." : "Agregar"}
            </Button>

            {user?.role === "ADMIN" && (
              <div className="flex gap-1 shrink-0">
                <Button
                  isIconOnly
                  className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                  radius="full"
                  size="sm"
                  variant="flat"
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <AiFillEdit size={16} />
                </Button>
                <Button
                  isIconOnly
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  radius="full"
                  size="sm"
                  variant="flat"
                  onPress={() => setIsDeleteModalOpen(true)}
                >
                  <AiFillDelete size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isEditModalOpen}
        title="Editar Producto"
        onClose={() => setIsEditModalOpen(false)}
      >
        <ProductEdit
          product={product}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => setIsEditModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        title="Eliminar Producto"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ProductConfirmDelete
          productId={product.id}
          productName={product.name}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </Modal>
    </>
  );
};
