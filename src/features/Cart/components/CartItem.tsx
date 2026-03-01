// src/features/Cart/components/CartItem.tsx
import React from "react";
import { formatPrice } from "@/utils/currencyFormat";
import { motion } from "framer-motion";
import { FaTrashCan, FaMinus, FaPlus } from "react-icons/fa6";
import { Button } from "@heroui/react";

import { useCart } from "../hooks/useCart";
import { useToast } from "../../../components/ui/ToastProvider";

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
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const itemTotal = formatPrice(item.price * item.quantity);
  const { removeItem, updateItem } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    updateItem(item.productId, newQuantity);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col sm:flex-row items-center gap-4 py-6 px-4 -mx-4 sm:mx-0 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors rounded-2xl"
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
            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-red-500 shadow-sm"
            radius="full"
            size="sm"
            variant="flat"
            onClick={() => {
              removeItem(item.productId);
              addToast(`${item.name} eliminado`, "info");
            }}
          >
            <FaTrashCan size={14} />
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow w-full gap-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-lg leading-tight">
            {item.name}
          </h4>
          <span className="hidden sm:block font-bold text-slate-900 dark:text-white text-lg">
            ${formatPrice(item.price)}
          </span>
        </div>

        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-3">
          Precio unitario: ${formatPrice(item.price)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Picker */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-zinc-700">
            <Button
              isIconOnly
              className="bg-white dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 shadow-sm disabled:opacity-30"
              isDisabled={item.quantity <= 1}
              radius="lg"
              size="sm"
              variant="flat"
              onClick={() => handleQuantityChange(-1)}
            >
              <FaMinus size={12} />
            </Button>

            <span className="w-10 text-center font-bold text-slate-800 dark:text-white">
              {item.quantity}
            </span>

            <Button
              isIconOnly
              className="bg-white dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 shadow-sm"
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
              <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                Total
              </p>
              <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xl">
                ${itemTotal}
              </p>
            </div>

            <Button
              isIconOnly
              className="hidden sm:flex text-slate-400 hover:text-red-500 transition-colors"
              radius="full"
              variant="light"
              onClick={() => {
                removeItem(item.productId);
                addToast(`${item.name} eliminado`, "info");
              }}
            >
              <FaTrashCan size={18} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
