import type { IProduct } from "../types/Product";

import { useEffect, useMemo } from "react";

import { ProductCard } from "./ProductCard";

export const ProductList = ({
  products,
  isLoading,
  restoreProductId,
  onRestoreComplete,
}: {
  products?: IProduct[];
  isLoading: boolean;
  restoreProductId?: string | null;
  onRestoreComplete?: () => void;
}) => {
  useEffect(() => {
    if (!restoreProductId || !products?.length) return;

    const found = products.some((product) => product.id === restoreProductId);

    if (!found) return;

    const frameId = window.requestAnimationFrame(() => {
      const el = document.getElementById(`product-card-${restoreProductId}`);

      if (el) {
        el.scrollIntoView({ block: "center", behavior: "auto" });
      }
      onRestoreComplete?.();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [restoreProductId, products, onRestoreComplete]);

  const featuredTopProducts = useMemo(() => {
    if (!products?.length) return [];

    const ranked = [...products]
      .filter(
        (product) =>
          product.topSellerRank !== null && product.topSellerRank !== undefined,
      )
      .sort(
        (a, b) => (a.topSellerRank ?? 999999) - (b.topSellerRank ?? 999999),
      );

    const rankedIds = new Set(ranked.map((product) => product.id));
    const fallback = products.filter((product) => !rankedIds.has(product.id));

    return [...ranked, ...fallback].slice(0, 5);
  }, [products]);

  const canRenderTopBlocks =
    (products?.length || 0) > 16 && featuredTopProducts.length >= 5;

  if (isLoading)
    return <p className="text-default-500">Cargando productos...</p>;

  if (!products?.length)
    //cartel centrado y con un icono de producto vacío
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <svg
          className="h-16 w-16 text-default-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4-8-4m8 4v10l-3-3M4 7l8 4m0 0l8-4m-8 4v10l-3-3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <p className="text-default-500 mt-4">No hay productos disponibles.</p>
      </div>
    );

  return (
    <main className="grid w-full grid-cols-2 gap-2 px-2 sm:grid-cols-3 sm:gap-3 sm:px-0 xl:grid-cols-4">
      {products.flatMap((product, index) => {
        const nodes = [
          <div key={product.id} id={`product-card-${product.id}`}>
            <ProductCard product={product} />
          </div>,
        ];

        const cardsRendered = index + 1;
        const shouldInsertTopBlock =
          canRenderTopBlocks &&
          cardsRendered % 8 === 0 &&
          cardsRendered / 8 <= 3 &&
          cardsRendered < products.length;

        if (shouldInsertTopBlock) {
          nodes.push(
            <div
              key={`top-label-${cardsRendered}`}
              className="col-span-full mx-2 mb-2 mt-10 text-[11px] font-bold uppercase tracking-wider text-default-500 sm:mx-0 sm:mt-12 sm:text-[14px]"
            >
              Recomendados de la categoría
            </div>,
          );
          nodes.push(
            <section
              key={`top-block-${cardsRendered}`}
              className="col-span-full mx-2 mb-10 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-content1 via-content1 to-primary/5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] ring-1 ring-primary/10 backdrop-blur-sm sm:mx-0 sm:mb-12 md:my-6 md:p-6"
            >
              <div className="flex overflow-x-auto no-scrollbar">
                {featuredTopProducts.map((topProduct, topIndex) => (
                  <div
                    key={`${topProduct.id}-top-${cardsRendered}-${topIndex}`}
                    className="w-36 shrink-0 sm:w-44"
                  >
                    <ProductCard disableHoverLift product={topProduct} />
                  </div>
                ))}
              </div>
            </section>,
          );
        }

        return nodes;
      })}
    </main>
  );
};
