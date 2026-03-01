import { apiClient } from "../../../services/apiClient";

export interface ShippingSettings {
  shippingPrice: number;
  largePurchaseThreshold: number;
}

export const getShippingSettings = async (): Promise<ShippingSettings> => {
  try {
    const { data } = await apiClient.get("/settings/shipping");
    // Si la API devuelve { value: { ... } }, usamos data.value.
    // Si devuelve el objeto directamente { shippingPrice, ... }, usamos data.
    // Si no hay nada, retornamos un objeto vacío para evitar que React Query falle.
    return data?.value || data || {};
  } catch (error) {
    console.warn(
      "No se pudieron cargar los ajustes de envío, usando valores por defecto.",
    );
    return {} as ShippingSettings;
  }
};

export const updateShippingSettings = async (settings: ShippingSettings) => {
  const { data } = await apiClient.put("/settings/shipping", {
    ...settings,
  });
  console.log(settings);
  return data;
};
