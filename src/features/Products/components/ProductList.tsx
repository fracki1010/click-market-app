import type { IProduct } from "../types/Product";

import { ProductCard } from "./ProductCard";

export const ProductList = ({
  products,
  isLoading,
}: {
  products?: IProduct[];
  isLoading: boolean;
}) => {
  if (isLoading)
    return <p className="text-default-500">Cargando productos...</p>;

  if (!products?.length)
    //cartel centrado y con un icono de producto vacío
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-default-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4-8-4m8 4v10l-3-3M4 7l8 4m0 0l8-4m-8 4v10l-3-3"
          />
        </svg>
        <p className="text-default-500 mt-4">No hay productos disponibles.</p>
      </div>
    );

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
};
