import type { IProduct } from "../types/Product";

import { LoadingComponent } from "../../../components/layout/LoadingComponent";

import { ProductCard } from "./ProductCard";

export const ProductList = ({
  products,
  isLoading,
}: {
  products?: IProduct[];
  isLoading: boolean;
}) => {
  if (isLoading) return <LoadingComponent />;

  if (!products?.length)
    return (
      <p className="text-gray-500 dark:text-gray-300">No products found.</p>
    );

  return (
    <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
};
