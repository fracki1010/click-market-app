import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/apiClient";

export interface AdminCustomer {
  userId: string | null;
  firebaseUid: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  authProvider: string;
  source: string;
  fromMongo: boolean;
  fromFirebase: boolean;
  createdAt: string | null;
}

interface AdminCustomersResponse {
  items: AdminCustomer[];
  total: number;
  firebaseSyncWarning?: string | null;
}

export const useAdminCustomers = (search: string = "") => {
  return useQuery({
    queryKey: ["admin-customers", search],
    queryFn: async () => {
      const query = search.trim()
        ? `?search=${encodeURIComponent(search.trim())}`
        : "";
      const { data } = await apiClient.get<AdminCustomersResponse>(
        `/stats/admin/customers${query}`,
      );

      return data;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};
