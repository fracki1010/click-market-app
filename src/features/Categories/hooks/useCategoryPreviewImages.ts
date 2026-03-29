import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { productService } from "@/features/Products/services/productService";

type CategoryPreview = {
  id: string;
  name: string;
};

export const useCategoryPreviewImages = (categories: CategoryPreview[]) => {
  const categoryPreviewQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["category-preview-image", category.name],
      queryFn: async () => {
        const response = await productService.getAll({
          categories: [category.name],
          limit: 1,
          page: 1,
        });

        return response.data[0]?.imageUrl || null;
      },
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  return useMemo(() => {
    const previewById = new Map<
      string,
      { imageUrl: string | null; isLoading: boolean }
    >();

    categories.forEach((category, index) => {
      const query = categoryPreviewQueries[index];

      previewById.set(category.id, {
        imageUrl: query?.data || null,
        isLoading: Boolean(query?.isLoading),
      });
    });

    return previewById;
  }, [categories, categoryPreviewQueries]);
};
