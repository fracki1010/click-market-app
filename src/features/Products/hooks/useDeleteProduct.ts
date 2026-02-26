import type { IProduct } from "../types/Product";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productService } from "../services/productService";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (productId) => productService.delete(productId),
    onSuccess: (_, deletedProductId) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      queryClient.setQueryData<IProduct[]>(["products"], (oldProducts) => {
        if (!oldProducts) return [];

        return oldProducts.filter((p) => p.id !== deletedProductId);
      });

      queryClient.removeQueries({ queryKey: ["products", deletedProductId] });
    },

    onError: (error) => {
      console.error("Error al eliminar el producto:", error);
    },
  });
}
