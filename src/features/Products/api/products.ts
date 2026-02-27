import type {
  IProduct,
  NewProductPayload,
  ProductsResponse,
  UpdateProductPayload,
} from "../types/Product";
import type { ProductApi } from "./mappers";

import { apiClient } from "../../../services/apiClient";

import { toProduct, toProductApiCreate, toProductApiUpdate } from "./mappers";

export async function getProducts(filters?: {
  categories?: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (filters?.categories?.length) {
    filters.categories.forEach((cat) => params.append("categories", cat));
  }
  if (filters?.price_min !== undefined)
    params.append("price_min", String(filters.price_min));
  if (filters?.price_max !== undefined)
    params.append("price_max", String(filters.price_max));

  if (filters?.sort) {
    switch (filters.sort) {
      case "price_asc":
        params.append("sort_by", "price");
        params.append("order", "asc");
        break;
      case "price_desc":
        params.append("sort_by", "price");
        params.append("order", "desc");
        break;
      case "newest":
        params.append("sort_by", "created_at");
        params.append("order", "desc");
        break;
      case "name_asc": // Ejemplo extra
        params.append("sort_by", "name");
        params.append("order", "asc");
        break;
    }
  }

  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);

  const response = await apiClient.get<{ data: ProductApi[]; pagination: any }>(
    "/products",
    {
      params,
    },
  );

  return {
    data: response.data.data.map(toProduct), // Mapeamos el array interno
    pagination: response.data.pagination, // Pasamos la info de paginación tal cual
  };
}

export async function getProductById(id: string): Promise<IProduct> {
  const response = await apiClient.get<ProductApi>(`/products/${id}`);

  return toProduct(response.data);
}

export async function createProduct(
  payload: NewProductPayload,
): Promise<IProduct> {
  const body = toProductApiCreate(payload);

  const response = await apiClient.post<ProductApi>("/products", body);

  return toProduct(response.data);
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<IProduct> {
  const body = toProductApiUpdate(payload);
  const response = await apiClient.patch<ProductApi>(`/products/${id}`, body);

  return toProduct(response.data);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
