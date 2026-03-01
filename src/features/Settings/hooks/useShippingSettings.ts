import { useQuery } from "@tanstack/react-query";
import { getShippingSettings } from "../api/settings";

/**
 * Hook para manejar la lógica de envíos (Click Market)
 * Sincronizado con el backend.
 */
export const useShippingSettings = () => {
  const {
    data: shippingConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shipping-settings"],
    queryFn: getShippingSettings,
    staleTime: 1000 * 60 * 10, // 10 minutos de caché
  });

  // Valores por defecto (mientras carga, si falla, o si el backend devuelve un objeto vacío)
  const shippingPriceConfig = shippingConfig?.shippingPrice ?? 1500;
  const thresholdConfig = shippingConfig?.largePurchaseThreshold ?? 20000;

  /**
   * Calcula el costo de envío según la lógica del backend
   * @param subtotal Suma de los precios de los productos en el carrito
   * @returns 0 si el subtotal supera el umbral, de lo contrario shippingPriceConfig
   */
  const calculateShipping = (subtotal: number): number => {
    // La lógica del backend utiliza >= thresholdConfig
    return subtotal >= thresholdConfig ? 0 : shippingPriceConfig;
  };

  return {
    shippingPriceConfig,
    thresholdConfig,
    calculateShipping,
    isLoading,
    error,
  };
};
