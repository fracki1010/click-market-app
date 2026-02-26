import type { ICategory } from "../types/Product";

import { apiClient } from "../../../services/apiClient";

import { toCategory, type CategoryApi } from "./mappers";

export async function getCategories(): Promise<ICategory[]> {
  const response = await apiClient.get<CategoryApi[]>("/categories");

  return response.data.map(toCategory);
}
