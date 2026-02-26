import type { ICategory } from "../types/Product";

import * as categoriesApi from "../api/categories";

export const categoriesService = {
  getAll: async (): Promise<ICategory[]> => {
    return await categoriesApi.getCategories();
  },
};
