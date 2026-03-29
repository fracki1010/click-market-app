import type { IProduct } from "../types/Product";

import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
// ... (rest of imports)
import { FaCartPlus, FaStar } from "react-icons/fa6";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/react";
import { motion } from "framer-motion";

import {
  getRatingFromTopSellerRank,
  getReviewCountFromTopSellerRank,
  getVisualStarsCount,
} from "../utils/topSellerRating";
import { useCart } from "../../Cart/hooks/useCart";
import { useAuth } from "../../Auth/hooks/useAuth";
import { Modal } from "../../../components/layout/Modal";
import { useToast } from "../../../components/ui/ToastProvider";

import { ProductConfirmDelete } from "./ProductConfirmDelete";
import { ProductEdit } from "./ProductEdit";

import { formatPrice } from "@/utils/currencyFormat";

interface ProductCardProps {
  product: IProduct;
  disableHoverLift?: boolean;
}

export const ProductCard = ({
  product,
  disableHoverLift = false,
}: ProductCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const onAdd = async () => {
    setIsAdding(true);
    await addItem(product, 1);
    addToast(`${product.name} agregado al carrito`, "success");
    setIsAdding(false);
  };

  const hasDiscount = product.price > 1000;
  const originalPrice = product.price * 1.2;
  const topSellerRating = getRatingFromTopSellerRank(product.topSellerRank);
  const reviewCount = getReviewCountFromTopSellerRank(product.topSellerRank);
  const visualStars = getVisualStarsCount(topSellerRating);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setHasImageError(false);
  }, [product.imageUrl]);

  return (
    <>
      <motion.div
        className="group bg-content1 shadow-md overflow-hidden border border-divider flex flex-col h-full transition-all duration-300"
        whileHover={!isMobile && !disableHoverLift ? { y: -4 } : undefined}
      >
        <Link
          className="flex flex-col flex-grow"
          to={`/products/${product.id}`}
          onClick={() => {
            sessionStorage.setItem("products:returnProductId", product.id);
            sessionStorage.setItem(
              "products:returnTo",
              `${location.pathname}${location.search}`,
            );
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-default-50">
            {product.imageUrl && !hasImageError ? (
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={product.imageUrl}
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-default-400 bg-gradient-to-br from-default-100 to-default-50">
                <FiImage size={28} />
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider">
                  Sin imagen
                </span>
              </div>
            )}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.topSellerRank && (
                <Chip
                  className="font-bold text-[9px] h-5 shadow-sm"
                  color="warning"
                  size="sm"
                  variant="solid"
                >
                  TOP #{product.topSellerRank}
                </Chip>
              )}
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
              <h3 className="text-[13px] font-semibold text-default-800 line-clamp-2 leading-snug h-9 mb-1">
                {product.name}
              </h3>

              {topSellerRating !== null && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < visualStars ? "opacity-100" : "opacity-25"
                        }
                        size={10}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-default-400 font-bold">
                    {topSellerRating.toFixed(1)}
                    {reviewCount ? ` (${reviewCount})` : ""}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                {hasDiscount && (
                  <span className="text-[11px] text-default-400 line-through font-medium">
                    ${formatPrice(originalPrice)}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-default-900">
                    ${formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] font-bold text-success">
                      15% OFF
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[10px] font-bold text-success mt-1">
                Llega mañana
              </p>
            </div>
          </div>
        </Link>

        {/* Action Buttons Section */}
        <div className="p-4 pt-0">
          <div className="flex items-center gap-2">
            <Button
              fullWidth
              className="font-black text-[12px] h-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary-600 text-primary-foreground"
              color="primary"
              disabled={isAdmin}
              isLoading={isAdding}
              radius="full"
              startContent={!isAdding && <FaCartPlus className="text-sm" />}
              onPress={onAdd}
            >
              {isAdding ? "Agregando..." : "Agregar"}
            </Button>

            {isAdmin && (
              <div className="flex gap-1 shrink-0">
                <Button
                  isIconOnly
                  className="bg-warning-50 text-warning"
                  radius="full"
                  size="sm"
                  variant="flat"
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <AiFillEdit size={16} />
                </Button>
                <Button
                  isIconOnly
                  className="bg-danger-50 text-danger"
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
