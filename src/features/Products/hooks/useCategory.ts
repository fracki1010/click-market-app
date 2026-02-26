import type { ICategory } from "../types/Product";

import { useQuery } from "@tanstack/react-query";

import { categoriesService } from "../services/categoriesService";

export function useCategories() {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
