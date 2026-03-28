import { apiClient } from "../../../services/apiClient";

export interface ShippingSettings {
  serviceCost: number;
  largePurchaseThreshold: number;
  minimumProducts: number;
}

const SHIPPING_PUBLIC_ENDPOINTS = [
  "/public/settings/storefront",
  "/public/settings/shipping",
  "/settings/shipping/public",
];

const SHIPPING_PRIVATE_ENDPOINT = "/settings/shipping";

const normalizeShippingSettings = (payload: any): ShippingSettings => {
  const raw = payload?.value || payload?.data || payload || {};

  const serviceCost = Number(
    raw?.serviceCost ??
      raw?.shippingCost ??
      raw?.shippingPrice ??
      raw?.shipping_cost ??
      raw?.shipping_price ??
      1500,
  );
  const largePurchaseThreshold = Number(
    raw?.largePurchaseThreshold ??
      raw?.freeShippingThreshold ??
      raw?.threshold ??
      raw?.large_purchase_threshold ??
      20000,
  );
  const minimumProducts = Number(
    raw?.minimumProducts ??
      raw?.minProducts ??
      raw?.minimum_products ??
      raw?.minimumOrderProducts ??
      raw?.minimum_items ??
      0,
  );

  return {
    serviceCost: Number.isFinite(serviceCost) ? serviceCost : 1500,
    largePurchaseThreshold: Number.isFinite(largePurchaseThreshold)
      ? largePurchaseThreshold
      : 20000,
    minimumProducts: Number.isFinite(minimumProducts) ? minimumProducts : 0,
  };
};

export const getShippingSettings = async (): Promise<ShippingSettings> => {
  try {
    // Prioridad: endpoint público (sin token)
    for (const endpoint of SHIPPING_PUBLIC_ENDPOINTS) {
      try {
        const { data } = await apiClient.get(endpoint);
        return normalizeShippingSettings(data);
      } catch (_error) {
        // Si no existe o falla, seguimos con el siguiente endpoint público.
      }
    }

    // Fallback temporal hasta que backend publique el endpoint definitivo.
    const { data } = await apiClient.get(SHIPPING_PRIVATE_ENDPOINT);
    return normalizeShippingSettings(data);
  } catch (error) {
    console.warn(
      "No se pudieron cargar los ajustes de envío, usando valores por defecto.",
    );
    return {
      serviceCost: 1500,
      largePurchaseThreshold: 20000,
      minimumProducts: 0,
    };
  }
};

export const updateShippingSettings = async (settings: ShippingSettings) => {
  const { data } = await apiClient.put("/settings/shipping", {
    ...settings,
  });
  return data;
};
