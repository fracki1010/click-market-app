export interface ICategory {
  id: string;
  name: string;
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
  // rating: number;
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
  // rating: number;
  categories: ICategory[];
  image_url: string;
  stock: number;
  stock_min: number;
  sku?: string;
};

export type UpdateProductPayload = Partial<NewProductPayload>;
