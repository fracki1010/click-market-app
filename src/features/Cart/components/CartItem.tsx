// src/features/Cart/components/CartItem.tsx
import React from "react";

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
  const itemTotal = (item.price * item.quantity).toFixed(2);
  const { removeItem, updateItem } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return;

    updateItem(item.productId, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-100 dark:border-neutral-700">
      {/* Imagen e Info */}
      <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
        <img
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
          src={item.image_url}
        />
        <div>
          <h4 className="font-medium text-gray-800 dark:text-gray-100">
            {item.name}
          </h4>
          <button
            className="text-red-500 text-sm flex items-center gap-1 hover:underline mt-1"
            onClick={() => {
              removeItem(item.productId);
              addToast(`${item.name} eliminado del carrito`, "info");
            }}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="font-medium text-gray-600 dark:text-gray-300">
        ${item.price.toFixed(2)}
      </div>

      <div className="flex items-center border border-gray-300 dark:border-neutral-600 rounded-md">
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 disabled:opacity-50"
          disabled={item.quantity <= 1} // Deshabilitar si es 1
          onClick={() => handleQuantityChange(-1)}
        >
          -
        </button>
        <span className="w-10 text-center font-medium text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700"
          onClick={() => handleQuantityChange(1)}
        >
          +
        </button>
      </div>

      <div className="font-bold text-gray-800 dark:text-gray-100 min-w-[80px] text-right">
        ${itemTotal}
      </div>
    </div>
  );
};
