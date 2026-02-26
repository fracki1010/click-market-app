import type {
  IProduct,
  ICategory,
  NewProductPayload,
  UpdateProductPayload,
} from "../types/Product";

// Definimos la respuesta de la API para categoría
export interface CategoryApi {
  _id: string;
  name: string;
  parent?: string | null; // El backend envía esto
}

export interface ProductApi {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  categories: { id: string; name: string }[];
  stock: number;
  stock_min: number;
  idExternal?: string;
}

// Mapeamos a nuestra interfaz
export function toCategory(api: CategoryApi): ICategory {
  return {
    id: api._id,
    name: api.name,
    parent: api.parent || null,
  };
}

export function toProduct(api: ProductApi): IProduct {
  return {
    id: api._id,
    name: api.name,
    description: api.description,
    price: api.price,
    imageUrl: api.image_url,
    categories: api.categories,
    stock: api.stock,
    stock_min: api.stock_min,
    sku: api.idExternal,
  };
}

export function toProductApiCreate(
  payload: NewProductPayload,
): Partial<ProductApi> & { categories?: { id: string; name: string }[] } {
  return {
    name: payload.name,
    description: payload.description,
    price: payload.price,
    categories: payload.categories,
    image_url: payload.image_url,
    stock: payload.stock,
    stock_min: payload.stock_min,
    idExternal: payload.sku,
  };
}

export function toProductApiUpdate(
  payload: UpdateProductPayload,
): Partial<ProductApi> & { categories?: { id: string; name: string }[] } {
  return {
    ...(payload.name && { name: payload.name }),
    ...(payload.description && { description: payload.description }),
    ...(payload.price && { price: payload.price }),
    ...(payload.categories && { categories: payload.categories }),
    ...(payload.image_url && { image_url: payload.image_url }),
    ...(payload.stock && { stock: payload.stock }),
    ...(payload.stock_min && { stock_min: payload.stock_min }),
    ...(payload.sku && { idExternal: payload.sku }),
  };
}
