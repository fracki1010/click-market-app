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
  _id?: string;
  id?: string;
  name?: string;
  nombre?: string;
  description?: string;
  price?: number;
  precio?: number;
  image_url?: string;
  imagen_url?: string;
  categories?: { id: string; name: string }[];
  categoria_principal?: string;
  subcategorias?: string[];
  stock?: number | string;
  es_mas_vendido?: boolean;
  ranking_mas_vendidos?: number | null;
  precio_lista?: number | null;
  oferta?: string | null;
  peso?: string | null;
  unidad?: string | null;
  url_producto?: string;
  fecha?: string;
  stock_min?: number;
  costPrice?: number;
  idExternal?: string;
  sku?: string;
  isHidden?: boolean;
}

const roundToTwoDecimals = (value: unknown): number => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.round((numericValue + Number.EPSILON) * 100) / 100;
};

const normalizeStock = (stock: unknown): { stock: number; stockLabel: string | null } => {
  if (typeof stock === "number" && Number.isFinite(stock)) {
    return { stock: stock >= 0 ? stock : 0, stockLabel: null };
  }

  if (typeof stock === "string") {
    const parsed = Number(stock);
    if (Number.isFinite(parsed)) {
      return { stock: parsed >= 0 ? parsed : 0, stockLabel: stock };
    }
    // Si llega "Disponible" mantenemos el producto comprable sin falsear stock bajo.
    return { stock: 999, stockLabel: stock };
  }

  return { stock: 0, stockLabel: null };
};

const mapCategories = (api: ProductApi): ICategory[] => {
  if (Array.isArray(api.categories) && api.categories.length > 0) {
    return api.categories;
  }

  const allNames = [
    api.categoria_principal,
    ...(Array.isArray(api.subcategorias) ? api.subcategorias : []),
  ].filter((value): value is string => Boolean(value && value.trim()));

  const uniqueNames = Array.from(new Set(allNames));
  return uniqueNames.map((name) => ({
    id: name,
    name,
    parent: null,
  }));
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
  const { stock, stockLabel } = normalizeStock(api.stock);

  const name = api.name || api.nombre || "Sin nombre";
  const description =
    api.description ||
    `Producto importado: ${name}${api.unidad ? ` (${api.unidad})` : ""}`;
  const price = roundToTwoDecimals(api.price ?? api.precio);
  const costPrice = roundToTwoDecimals(api.costPrice ?? api.price ?? api.precio);

  return {
    id: String(api._id || api.id || api.sku || api.idExternal || ""),
    name,
    description,
    price,
    costPrice,
    imageUrl: api.image_url || api.imagen_url,
    categories: mapCategories(api),
    stock,
    stockLabel,
    stock_min:
      typeof api.stock_min === "number" && Number.isFinite(api.stock_min)
        ? api.stock_min
        : 1,
    sku: api.idExternal || api.sku,
    listPrice:
      api.precio_lista === null || api.precio_lista === undefined
        ? null
        : roundToTwoDecimals(api.precio_lista),
    offer: api.oferta || null,
    weight: api.peso || null,
    unit: api.unidad || null,
    mainCategory: api.categoria_principal || null,
    subcategories: api.subcategorias || [],
    isTopSeller: Boolean(api.es_mas_vendido),
    topSellerRank:
      api.ranking_mas_vendidos === null || api.ranking_mas_vendidos === undefined
        ? null
        : Number(api.ranking_mas_vendidos),
    productUrl: api.url_producto,
    sourceDate: api.fecha,
    isHidden: Boolean(api.isHidden),
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
