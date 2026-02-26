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
  console.log("getCart");

  const { data } = await apiClient.get(`/cart`);

  console.log(data);

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
  console.log("productId", productId);
  console.log("quantity", quantity);

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
