import type { PaginatedProducts } from "../types/Product";

import { useInfiniteQuery } from "@tanstack/react-query";

import { productService } from "../services/productService";

export function useInfiniteProducts(
  filters: any,
  options?: {
    enabled?: boolean;
  },
) {
  // Excluimos 'page' de los filtros para la queryKey de infinite scroll
  // porque el scroll maneja su propia paginación interna
  const { page, ...otherFilters } = filters;

  return useInfiniteQuery<PaginatedProducts, Error>({
    queryKey: ["products", "infinite", otherFilters],
    queryFn: ({ pageParam = 1 }) =>
      productService.getAll({ ...otherFilters, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}
