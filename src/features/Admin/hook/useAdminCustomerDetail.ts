import { useQuery } from "@tanstack/react-query";

import { MovementItem } from "../api/movements";

import { toOrder } from "@/features/Order/api/mappers";
import { IOrder } from "@/features/Order/types/Order";
import { apiClient } from "@/services/apiClient";

export interface AdminCustomerDetail {
  userId: string | null;
  firebaseUid: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  authProvider: string;
  source: string;
  fromMongo: boolean;
  createdAt: string | null;
}

export interface AdminCustomerStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalItems: number;
  totalSpent: number;
  activeRevenue: number;
  averageTicket: number;
  lastOrderDate: string | null;
  firstOrderDate: string | null;
  statusBreakdown: Record<string, number>;
  paymentBreakdown: Record<string, number>;
  topProducts: {
    name: string;
    quantity: number;
    amount: number;
  }[];
  movementsTotal: number;
  lastMovementAt: string | null;
  movementStatusBreakdown: Record<string, number>;
}

interface AdminCustomerDetailResponse {
  customer: AdminCustomerDetail;
  stats: AdminCustomerStats;
  orders: any[];
  movements: MovementItem[];
}

export interface UseAdminCustomerDetailParams {
  customerId: string;
  email?: string;
  firebaseUid?: string;
  name?: string;
  phone?: string;
  source?: string;
}

export const useAdminCustomerDetail = ({
  customerId,
  email,
  firebaseUid,
  name,
  phone,
  source,
}: UseAdminCustomerDetailParams) => {
  return useQuery({
    queryKey: [
      "admin-customer-detail",
      customerId,
      email,
      firebaseUid,
      name,
      phone,
      source,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (email) params.set("email", email);
      if (firebaseUid) params.set("firebaseUid", firebaseUid);
      if (name) params.set("name", name);
      if (phone) params.set("phone", phone);
      if (source) params.set("source", source);

      const queryString = params.toString();
      const path = `/stats/admin/customers/${encodeURIComponent(customerId)}/detail${
        queryString ? `?${queryString}` : ""
      }`;

      const { data } = await apiClient.get<AdminCustomerDetailResponse>(path);

      return {
        customer: data.customer,
        stats: data.stats,
        orders: (data.orders || []).map((item) => toOrder(item)) as IOrder[],
        movements: data.movements || [],
      };
    },
    enabled: !!customerId,
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 20,
  });
};
