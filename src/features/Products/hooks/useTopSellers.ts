import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../services/apiClient";
import { toProduct, type ProductApi } from "../api/mappers";

export interface TopProduct {
  _id: string;
  totalSold: number;
  revenue: number;
  name: string;
  image: string | null;
  currentPrice: number;
}

export interface TopCategory {
  _id: string;
  totalSold: number;
  revenue: number;
  name: string;
}

export const useTopSellers = () => {
  return useQuery<TopProduct[]>({
    queryKey: ["top-sellers"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/stats/products/top-sellers");

        return data;
      } catch {
        const { data } = await apiClient.get<{
          data: ProductApi[];
        }>("/products", {
          params: {
            sort_by: "ranking_mas_vendidos",
            order: "asc",
            limit: 10,
          },
        });

        return (data?.data || [])
          .map(toProduct)
          .filter(
            (product) => product.isTopSeller || product.topSellerRank !== null,
          )
          .sort(
            (a, b) => (a.topSellerRank ?? 999999) - (b.topSellerRank ?? 999999),
          )
          .slice(0, 10)
          .map((product) => ({
            _id: product.id,
            totalSold: product.topSellerRank
              ? Math.max(1, 3655 - product.topSellerRank)
              : 0,
            revenue: 0,
            name: product.name,
            image: product.imageUrl || null,
            currentPrice: product.price,
          }));
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour for public home page
  });
};

export const useTopCategorySellers = () => {
  return useQuery<TopCategory[]>({
    queryKey: ["top-category-sellers"],
    queryFn: async () => {
      const { data } = await apiClient.get("/stats/categories/top-sellers");

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
