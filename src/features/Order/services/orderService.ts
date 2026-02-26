import type { IOrder, CreateOrderPayload } from "../types/Order";

import * as orderApi from "../api/orders";

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<IOrder> => {
    return await orderApi.createOrder(payload);
  },

  getMyOrders: async (): Promise<IOrder[]> => {
    return await orderApi.getMyOrders();
  },

  // updateOrderStatus: async (orderId: string, status: string): Promise<IOrder> => {
  //     return await orderApi.updateOrderStatus(orderId, status);
  // },
};
