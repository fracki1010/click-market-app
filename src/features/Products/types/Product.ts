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
  imageUrl?: string;
  categories: ICategory[];
  stock: number;
  stock_min: number;
  sku?: string;
}

export type NewProductPayload = {
  name: string;
  description: string;
  price: number;
  categories: ICategory[];
  image_url: string;
  stock: number;
  stock_min: number;
  sku?: string;
};

export type UpdateProductPayload = Partial<NewProductPayload>;
