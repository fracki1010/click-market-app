import { useQuery } from "@tanstack/react-query";

import { getShippingSettings } from "../api/settings";

/**
 * Hook para manejar la lógica de costo del servicio (Click Market)
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
  const serviceCostConfig =
    shippingConfig?.serviceCost ??
    (shippingConfig as any)?.shippingPrice ??
    1500;
  const thresholdConfig = shippingConfig?.largePurchaseThreshold ?? 20000;
  const minimumProductsConfig = Math.max(
    0,
    Math.floor(Number(shippingConfig?.minimumProducts ?? 0) || 0),
  );

  /**
   * Calcula el costo del servicio según la lógica del backend
   * @param subtotal Suma de los precios de los productos en el carrito
   * @returns 0 si el subtotal supera el umbral, de lo contrario serviceCostConfig
   */
  const calculateServiceCost = (subtotal: number): number => {
    // La lógica del backend utiliza >= thresholdConfig
    return subtotal >= thresholdConfig ? 0 : serviceCostConfig;
  };

  const isMinimumProductsMet = (productUnits: number): boolean =>
    minimumProductsConfig === 0 || productUnits >= minimumProductsConfig;

  const getMinimumProductsMessage = (productUnits?: number): string => {
    if (minimumProductsConfig === 0) {
      return "Cantidad de productos libre. No hay mínimo requerido.";
    }

    if (typeof productUnits !== "number") {
      return `Pedido mínimo: ${minimumProductsConfig} productos.`;
    }

    const missing = minimumProductsConfig - productUnits;

    if (missing > 0) {
      return `Pedido mínimo: ${minimumProductsConfig} productos. Te faltan ${missing}.`;
    }

    return `Pedido mínimo cumplido: ${minimumProductsConfig} productos.`;
  };

  return {
    serviceCostConfig,
    thresholdConfig,
    minimumProductsConfig,
    calculateServiceCost,
    isMinimumProductsMet,
    getMinimumProductsMessage,
    isLoading,
    error,
  };
};
