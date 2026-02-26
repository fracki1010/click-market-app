export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  cartId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface CartApi {
  id: string;
  user_id: string;
  total: number;
  items: CartItemApi[];
}

export interface CartItemApi {
  cart_id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export interface CartItemPayload {
  product_id: string;
  quantity: number;
}
