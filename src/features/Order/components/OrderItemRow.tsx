import React from "react";
import { FaBoxOpen } from "react-icons/fa6";
import { formatPrice } from "@/utils/currencyFormat";

interface OrderItemRowProps {
  item: {
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string;
    };
  };
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => {
  const totalItem = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 group hover:bg-default-50 px-2 -mx-2 transition-colors rounded-2xl">
      {/* Sección Izquierda: Imagen y Datos */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-default-50 border border-divider">
          {item.product.imageUrl ? (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-default-300">
              <FaBoxOpen size={20} />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm sm:text-base font-bold text-default-800 truncate">
            {item.product.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-black text-success bg-success-50 px-2 py-0.5 rounded-md">
              x{item.quantity}
            </span>
            <span className="text-xs font-bold text-default-400">
              ${formatPrice(item.price)} c/u
            </span>
          </div>
        </div>
      </div>

      {/* Sección Derecha: Precio Total */}
      <div className="pl-0 sm:pl-4 text-left sm:text-right flex flex-col self-end sm:self-auto">
        <span className="text-xs font-black text-default-300 uppercase tracking-tighter">
          Subtotal
        </span>
        <p className="text-base sm:text-lg font-black text-default-900 leading-none">
          ${formatPrice(totalItem)}
        </p>
      </div>
    </div>
  );
};
