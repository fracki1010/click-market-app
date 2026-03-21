import type { CreateOrderPayload } from "../types/Order";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { orderService } from "../services/orderService";
import { useCart } from "../../Cart/hooks/useCart";

import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/services/apiClient";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
    staleTime: 1000 * 30, // Reducir staleTime para mayor frescura
    refetchInterval: 1000 * 10, // Refrescar cada 10 segundos
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 5, // Más frecuente en el detalle para cambios de estado rápidos
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.create(payload),
    onSuccess: async (order) => {
      const createdOrderId = order?.id;

      if (createdOrderId) {
        // Navegar primero a la pantalla de éxito para evitar la redirección
        // del checkout cuando el carrito queda vacío.
        navigate(`/checkout/success/${createdOrderId}`);
      } else {
        // Fallback de seguridad para evitar rutas inválidas
        navigate("/my-orders");
      }

      // Vaciar carrito
      await emptyCart();

      // Invalidar caché para que se recargue la lista de órdenes
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      const backendMsg =
        error?.response?.data?.msg || "No se pudo procesar el pedido";
      addToast(backendMsg, "error");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/orders/${id}/status`, { status });

      return res.data;
    },
    onSuccess: (_, { id }) => {
      // Invalidar todo lo relacionado a órdenes para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      addToast("¡Gracias por confirmar la entrega!", "success");
    },
    onError: () => {
      addToast("Error al actualizar la orden", "error");
    },
  });
};
