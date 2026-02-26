import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { apiClient } from "../../../services/apiClient";

import { toOrder } from "@/features/Order/api/mappers";
import { useToast } from "@/components/ui/ToastProvider";

// Ahora recibe la página como parámetro
export const useAdminOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ["admin-orders", page], // La key depende de la página
    queryFn: async () => {
      // Asumimos que tu backend soporta queries ?page=1
      const { data } = await apiClient.get(`/orders/admin/all?page=${page}`);

      return {
        orders: data.orders.map(toOrder), // Mapeamos el arreglo
        page: data.page,
        pages: data.pages,
        total: data.total,
      };
    },
    placeholderData: keepPreviousData, // Evita parpadeos en la tabla al cambiar de página
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
