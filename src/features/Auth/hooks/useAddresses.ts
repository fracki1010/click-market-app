import { useState, useEffect } from "react";
import { apiClient } from "../../../services/apiClient";
import { Address, CreateAddressPayload } from "../types/Address";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/addresses");
      setAddresses(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching addresses:", err);
      setError("No se pudieron cargar las direcciones");
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (payload: CreateAddressPayload) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/addresses", payload);
      setAddresses((prev) => [...prev, response.data.address]);
      setError(null);
      return response.data;
    } catch (err: any) {
      console.error("Error adding address:", err);
      setError("No se pudo agregar la dirección");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setLoading(true);
    try {
      await apiClient.delete(`/auth/addresses/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      setError(null);
    } catch (err: any) {
      console.error("Error deleting address:", err);
      setError("No se pudo eliminar la dirección");
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id: string) => {
    setLoading(true);
    try {
      await apiClient.put(`/auth/addresses/${id}/default`);
      // Actualizamos localmente: todas falsas excepto la seleccionada
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === id,
        })),
      );
      setError(null);
    } catch (err: any) {
      console.error("Error setting default address:", err);
      setError("No se pudo establecer como predeterminada");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    refreshAddresses: fetchAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
