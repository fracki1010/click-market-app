import type {
  IProduct,
  NewProductPayload,
  UpdateProductPayload,
} from "../types/Product";

import * as productApi from "../api/products";

export const productService = {
  getAll: async (filters?: {
    categories?: string[];
    price_min?: number;
    price_max?: number;
    sort?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    return await productApi.getProducts(filters);
  },
  getById: async (id: string): Promise<IProduct> => {
    return await productApi.getProductById(id);
  },
  create: async (payload: NewProductPayload): Promise<IProduct> => {
    return await productApi.createProduct(payload);
  },
  update: async (
    id: string,
    payload: UpdateProductPayload,
  ): Promise<IProduct> => {
    return await productApi.updateProduct(id, payload);
  },
  delete: async (id: string): Promise<void> => {
    return await productApi.deleteProduct(id);
  },
};
