// src/features/Cart/components/CartItem.tsx
import React from "react";
import { motion } from "framer-motion";
import { FaTrashCan, FaMinus, FaPlus } from "react-icons/fa6";
import { Button } from "@heroui/react";

import { useCart } from "../hooks/useCart";
import { useToast } from "../../../components/ui/ToastProvider";

import { formatPrice } from "@/utils/currencyFormat";

interface CartItemData {
  cartId?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartItemProps {
  item: CartItemData;
  viewMode?: "cards" | "compact";
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  viewMode = "cards",
}) => {
  const itemTotal = formatPrice(item.price * item.quantity);
  const { removeItem, updateItem } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return;
    updateItem(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId);
    addToast(`${item.name} eliminado`, "info");
  };

  if (viewMode === "compact") {
    return (
      <motion.div
        layout
        animate={{ opacity: 1, y: 0 }}
        className="group relative flex items-center gap-3 rounded-2xl border border-divider bg-content1 p-3"
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <img
          alt={item.name}
          className="h-16 w-16 rounded-xl object-cover"
          src={item.image_url}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-default-800">
            {item.name}
          </p>
          <p className="text-xs text-default-500">
            ${formatPrice(item.price)} c/u
          </p>
          <p className="text-sm font-extrabold text-success">${itemTotal}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center rounded-xl border border-divider bg-default-100 p-1">
            <Button
              isIconOnly
              className="bg-background text-default-600 shadow-sm disabled:opacity-30"
              isDisabled={item.quantity <= 1}
              radius="lg"
              size="sm"
              variant="flat"
              onClick={() => handleQuantityChange(-1)}
            >
              <FaMinus size={10} />
            </Button>
            <span className="w-8 text-center text-sm font-bold text-default-800">
              {item.quantity}
            </span>
            <Button
              isIconOnly
              className="bg-background text-default-600 shadow-sm"
              radius="lg"
              size="sm"
              variant="flat"
              onClick={() => handleQuantityChange(1)}
            >
              <FaPlus size={10} />
            </Button>
          </div>

          <Button
            isIconOnly
            className="text-default-400 hover:text-danger transition-colors"
            radius="full"
            size="sm"
            variant="light"
            onClick={handleRemove}
          >
            <FaTrashCan size={14} />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col sm:flex-row items-center gap-4 py-6 px-4 -mx-4 sm:mx-0 hover:bg-default-50 transition-all rounded-2xl"
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen Section */}
      <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
        <img
          alt={item.name}
          className="w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
          src={item.image_url}
        />
        <div className="absolute top-2 right-2 sm:hidden">
          <Button
            isIconOnly
            className="bg-background/90 backdrop-blur-sm text-danger shadow-sm"
            radius="full"
            size="sm"
            variant="flat"
            onClick={handleRemove}
          >
            <FaTrashCan size={14} />
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow w-full gap-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-default-800 text-lg leading-tight">
            {item.name}
          </h4>
          <span className="hidden sm:block font-bold text-default-900 text-lg">
            ${formatPrice(item.price)}
          </span>
        </div>

        <p className="text-default-500 text-sm mb-3">
          Precio unitario: ${formatPrice(item.price)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Picker */}
          <div className="flex items-center bg-default-100 rounded-xl p-1 border border-divider">
            <Button
              isIconOnly
              className="bg-background text-default-600 shadow-sm disabled:opacity-30"
              isDisabled={item.quantity <= 1}
              radius="lg"
              size="sm"
              variant="flat"
              onClick={() => handleQuantityChange(-1)}
            >
              <FaMinus size={12} />
            </Button>

            <span className="w-10 text-center font-bold text-default-800">
              {item.quantity}
            </span>

            <Button
              isIconOnly
              className="bg-background text-default-600 shadow-sm"
              radius="lg"
              size="sm"
              variant="flat"
              onClick={() => handleQuantityChange(1)}
            >
              <FaPlus size={12} />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-default-400 uppercase tracking-wider font-semibold">
                Total
              </p>
              <p className="font-extrabold text-success text-xl">
                ${itemTotal}
              </p>
            </div>

            <Button
              isIconOnly
              className="hidden sm:flex text-default-400 hover:text-danger transition-colors"
              radius="full"
              variant="light"
              onClick={handleRemove}
            >
              <FaTrashCan size={18} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
