import type { IOrder, CreateOrderPayload, OrderApi } from "../types/Order";

import { apiClient } from "../../../services/apiClient";

import { toOrder } from "./mappers";

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<IOrder> {
  const response = await apiClient.post<{
    msg?: string;
    orderNumber?: string;
    order?: OrderApi;
  } & Partial<OrderApi>>("/orders", payload);

  const rawOrder = response.data?.order || response.data;
  return toOrder(rawOrder);
}

export async function getMyOrders(): Promise<IOrder[]> {
  const response = await apiClient.get<OrderApi[]>("/orders/my-orders");

  return response.data.map(toOrder);
}

export async function getOrderById(id: string): Promise<IOrder> {
  const response = await apiClient.get<OrderApi>(`/orders/${id}`);

  return toOrder(response.data);
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
