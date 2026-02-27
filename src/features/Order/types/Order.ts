export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export interface IShippingDetails {
  address: string;
  neighborhood: string;
  deliveryNotes?: string;
  deliverySlot: string;
}

export interface IPaymentDetails {
  method: "Cash" | "Card" | "Transfer";
  status: string;
}

export interface IOrder {
  id: string; // El _id de mongo
  orderNumber?: string; // El CK-123456
  userId: string;
  orderDate: string;
  status: string;
  customerName?: string;
  // Nuevos campos de logística y pago
  shipping: IShippingDetails;
  payment: IPaymentDetails;

  // Desglose de precios
  subtotal: number;
  shippingPrice: number;
  total: number;

  items: IOrderItem[];
}

// Lo que viene de la API (Backend)
export interface OrderApi {
  _id: string;
  orderNumber?: string;
  user: string;
  createdAt: string;
  status: string;

  shipping: {
    address: string;
    neighborhood: string;
    deliveryNotes: string;
    deliverySlot: string;
  };

  payment: {
    method: "Cash" | "Card" | "Transfer";
    status: string;
  };

  subtotal: number;
  shippingPrice: number;
  total: number;

  items: {
    product: {
      _id: string;
      name: string;
      image: string; // Ojo, en tu backend pusiste 'image' en el orderItemSchema
    };
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

// Lo que enviamos para crear la orden
export interface CreateOrderPayload {
  shippingDetails?: {
    address: string;
    neighborhood: string;
    deliveryNotes: string;
  };
  deliverySlot: string;
  paymentMethod: "Cash" | "Card" | "Transfer";
}
