export interface ICategory {
  id: string;
  name: string;
  parent?: string | null; // Nuevo campo: ID del padre
  children?: ICategory[]; // Usaremos esto en el frontend para armar el árbol
}

export interface ProductsResponse {
  data: IProduct[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PaginatedProducts {
  data: IProduct[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  imageUrl?: string;
  categories: ICategory[];
  stock: number;
  stockLabel?: string | null;
  stock_min: number;
  sku?: string;
  listPrice?: number | null;
  offer?: string | null;
  weight?: string | null;
  unit?: string | null;
  mainCategory?: string | null;
  subcategories?: string[];
  isTopSeller?: boolean;
  topSellerRank?: number | null;
  productUrl?: string;
  sourceDate?: string;
  isHidden?: boolean;
}

export type NewProductPayload = {
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  categories: ICategory[];
  image_url: string;
  stock: number;
  stock_min: number;
  sku?: string;
};

export type UpdateProductPayload = Partial<NewProductPayload>;
