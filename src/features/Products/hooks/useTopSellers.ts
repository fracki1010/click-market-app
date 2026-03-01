import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";

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
      const { data } = await apiClient.get("/stats/products/top-sellers");
      return data;
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
