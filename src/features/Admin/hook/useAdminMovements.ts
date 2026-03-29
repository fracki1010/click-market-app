import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminMovements, type MovementFilters } from "../api/movements";

export const useAdminMovements = (filters: MovementFilters = {}) => {
  return useQuery({
    queryKey: ["admin-movements", filters],
    queryFn: () => getAdminMovements(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 20,
  });
};
