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
    return <p className="text-default-500">No products found.</p>;

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
};
