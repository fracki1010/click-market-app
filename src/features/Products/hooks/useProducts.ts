import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { PaginatedProducts } from "../types/Product";

export function useProducts(filters: any) {
  return useQuery<PaginatedProducts, Error>({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
