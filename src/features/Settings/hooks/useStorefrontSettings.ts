import { useQuery } from "@tanstack/react-query";

import {
  getStorefrontSettings,
  type StorefrontSettings,
} from "../api/settings";

export function useStorefrontSettings() {
  return useQuery<StorefrontSettings, Error>({
    queryKey: ["storefront-settings"],
    queryFn: () => getStorefrontSettings(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
