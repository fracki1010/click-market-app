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

const buildAdminOrdersUrl = ({
  page,
  startDate,
  endDate,
}: UseAdminOrdersParams) => {
  let url = `/orders/admin/all?page=${page}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return url;
};

export const useAdminOrders = ({
  page = 1,
  startDate,
  endDate,
}: UseAdminOrdersParams = {}) => {
  return useQuery({
    queryKey: ["admin-orders", page, startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get(
        buildAdminOrdersUrl({ page, startDate, endDate }),
      );

      return {
        orders: data.orders.map(toOrder),
        page: data.page,
        pages: data.pages,
        total: data.total,
      };
    },
    placeholderData: keepPreviousData,
    refetchInterval: 1000 * 10,
    staleTime: 1000 * 30, // Un tiempo de expiración más corto para sincronizar mejor
  });
};

export const useAdminAllOrders = ({
  startDate,
  endDate,
}: Omit<UseAdminOrdersParams, "page"> = {}) => {
  return useQuery({
    queryKey: ["admin-orders-all", startDate, endDate],
    queryFn: async () => {
      const firstPageResponse = await apiClient.get(
        buildAdminOrdersUrl({ page: 1, startDate, endDate }),
      );
      const firstPageData = firstPageResponse.data;

      const pages = Number(firstPageData?.pages || 1);
      const allRawOrders = [...(firstPageData?.orders || [])];

      if (pages > 1) {
        const requests: Promise<any>[] = [];
        for (let page = 2; page <= pages; page += 1) {
          requests.push(
            apiClient.get(buildAdminOrdersUrl({ page, startDate, endDate })),
          );
        }

        const responses = await Promise.all(requests);
        for (const response of responses) {
          allRawOrders.push(...(response.data?.orders || []));
        }
      }

      return allRawOrders.map(toOrder);
    },
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 30,
  });
};

export const useAdminOrderById = (id: string) => {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/orders/admin/${id}`);

      return toOrder(data);
    },
    enabled: !!id,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 5, // Muy frecuente en el detalle para cambios de estado rápidos
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
    onSuccess: (_, { id }) => {
      // Invalidar en cascada para que todas las vistas se actualicen
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
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
