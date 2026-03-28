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
  costPrice: number;
  image_url?: string;
  categories: { id: string; name: string }[];
  stock: number;
  stock_min: number;
  idExternal?: string;
}

const roundToTwoDecimals = (value: unknown): number => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.round((numericValue + Number.EPSILON) * 100) / 100;
};

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
    price: roundToTwoDecimals(api.price),
    costPrice: roundToTwoDecimals(api.costPrice),
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
    price: roundToTwoDecimals(payload.price),
    costPrice: roundToTwoDecimals(payload.costPrice),
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
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.price !== undefined && {
      price: roundToTwoDecimals(payload.price),
    }),
    ...(payload.costPrice !== undefined && {
      costPrice: roundToTwoDecimals(payload.costPrice),
    }),
    ...(payload.categories !== undefined && { categories: payload.categories }),
    ...(payload.image_url !== undefined && { image_url: payload.image_url }),
    ...(payload.stock !== undefined && { stock: payload.stock }),
    ...(payload.stock_min !== undefined && { stock_min: payload.stock_min }),
    ...(payload.sku !== undefined && { idExternal: payload.sku }),
  };
}
