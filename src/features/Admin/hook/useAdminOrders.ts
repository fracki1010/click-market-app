import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { apiClient } from "../../../services/apiClient";

import { toOrder } from "@/features/Order/api/mappers";
import { useToast } from "@/components/ui/ToastProvider";

interface UseAdminOrdersParams {
  page?: number;
  startDate?: string;
  endDate?: string;
}

export const useAdminOrders = ({
  page = 1,
  startDate,
  endDate,
}: UseAdminOrdersParams = {}) => {
  return useQuery({
    queryKey: ["admin-orders", page, startDate, endDate],
    queryFn: async () => {
      let url = `/orders/admin/all?page=${page}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const { data } = await apiClient.get(url);

      return {
        orders: data.orders.map(toOrder),
        page: data.page,
        pages: data.pages,
        total: data.total,
      };
    },
    placeholderData: keepPreviousData,
  });
};

export const useAdminOrderById = (id: string) => {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/orders/${id}`);

      console.log(data);
      return toOrder(data);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/orders/${id}/status`, { status });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      addToast("Estado del pedido actualizado", "success");
    },
    onError: () => {
      addToast("Error al actualizar el pedido", "error");
    },
  });
};

export const useOrderInvoice = () => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `factura-${orderId.slice(-6).toUpperCase()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      addToast("Factura descargada correctamente", "success");
    },
    onError: () => {
      addToast("Error al descargar la factura", "error");
    },
  });
};
