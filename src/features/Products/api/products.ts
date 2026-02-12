import { log } from "console";
import { apiClient } from "../../../services/apiClient";
import type {
  IProduct,
  NewProductPayload,
  ProductsResponse,
  UpdateProductPayload,
} from "../types/Product";
import type { ProductApi } from "./mappers";
import { toProduct, toProductApiCreate, toProductApiUpdate } from "./mappers";

export async function getProducts(filters?: {
  categories?: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
  page?: number;
  limit?: number;
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

  const response = await apiClient.get<{ data: ProductApi[]; pagination: any }>(
    "/products",
    {
      params,
    },
  );

  console.log(response.data);

  return {
    data: response.data.data.map(toProduct), // Mapeamos el array interno
    pagination: response.data.pagination, // Pasamos la info de paginación tal cual
  };
}

export async function getProductById(id: number): Promise<IProduct> {
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
  id: number,
  payload: UpdateProductPayload,
): Promise<IProduct> {
  const body = toProductApiUpdate(payload);
  const response = await apiClient.patch<ProductApi>(`/products/${id}`, body);
  return toProduct(response.data);
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
