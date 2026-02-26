import type { IOrder, CreateOrderPayload, OrderApi } from "../types/Order";

import { apiClient } from "../../../services/apiClient";

import { toOrder } from "./mappers";

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<IOrder> {
  const response = await apiClient.post<OrderApi>("/orders", payload);

  return toOrder(response.data);
}

export async function getMyOrders(): Promise<IOrder[]> {
  const response = await apiClient.get<OrderApi[]>("/orders/my-orders");

  return response.data.map(toOrder);
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<IOrder> {
  const response = await apiClient.patch<OrderApi>(
    `/orders/${orderId}/status`,
    { status },
  );

  return toOrder(response.data);
}
