// src/features/products/hooks/useProduct.ts
import type { IProduct } from "../types/Product";

import { useQuery } from "@tanstack/react-query";

import { productService } from "../services/productService";

export function useProduct(id: string) {
  return useQuery<IProduct, Error>({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id, // Solo ejecuta si el ID es válido
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
