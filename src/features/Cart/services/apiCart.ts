import type { IProduct } from "../../Products/types/Product";

import { apiClient } from "../../../services/apiClient";

export interface CartItem {
  id: string;
  product: IProduct;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

export const getCart = async (): Promise<Cart> => {
  const { data } = await apiClient.get(`/cart`);

  return data;
};

export const addItemToCart = async (productId: string, quantity: number) => {
  const { data } = await apiClient.post(`/cart`, {
    product_id: productId,
    quantity,
  });

  return data;
};

export const updateItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  const { data } = await apiClient.put(`/cart`, {
    product_id: productId,
    quantity,
  });

  return data;
};

export const removeItemFromCart = async (itemId: string) => {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`);

  return data;
};

export const clearCart = async () => {
  const { data } = await apiClient.delete(`/cart`);

  return data;
};
