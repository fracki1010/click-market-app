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
    <div className="flex items-center justify-between py-4 group hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-2 -mx-2 transition-colors rounded-2xl">
      {/* Sección Izquierda: Imagen y Datos */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
          {item.product.imageUrl ? (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-300">
              <FaBoxOpen size={20} />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-base font-bold text-slate-800 dark:text-zinc-100 truncate">
            {item.product.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
              x{item.quantity}
            </span>
            <span className="text-xs font-bold text-slate-400">
              ${formatPrice(item.price)} c/u
            </span>
          </div>
        </div>
      </div>

      {/* Sección Derecha: Precio Total */}
      <div className="pl-4 text-right flex flex-col">
        <span className="text-xs font-black text-slate-300 dark:text-zinc-600 uppercase tracking-tighter">
          Subtotal
        </span>
        <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
          ${formatPrice(totalItem)}
        </p>
      </div>
    </div>
  );
};
