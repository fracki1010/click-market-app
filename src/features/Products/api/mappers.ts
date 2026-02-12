import type {
  IProduct,
  ICategory,
  NewProductPayload,
  UpdateProductPayload,
} from "../types/Product";

export interface ProductApi {
  _id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image_url?: string;
  categories: { id: string; name: string }[];
  stock: number;
  stock_min: number;
  idExternal?: string;
}

export function toProduct(api: ProductApi): IProduct {
  return {
    id: api._id,
    name: api.name,
    description: api.description,
    price: api.price,
    // rating: api.rating,
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
    // rating: payload.rating,
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
    // ...(payload.rating && { rating: payload.rating }),
    ...(payload.categories && { categories: payload.categories }),
  };
}

export interface CategoryApi {
  id: string;
  name: string;
}
export function toCategory(api: CategoryApi): ICategory {
  return {
    id: api.id,
    name: api.name,
  };
}
