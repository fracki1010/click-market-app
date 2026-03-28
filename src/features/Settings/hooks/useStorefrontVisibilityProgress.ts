import { useQuery } from "@tanstack/react-query";

import { getStorefrontVisibilityProgress } from "../api/settings";

export function useStorefrontVisibilityProgress(forcePolling = false) {
  return useQuery({
    queryKey: ["storefront-visibility-progress"],
    queryFn: getStorefrontVisibilityProgress,
    refetchInterval: (query) =>
      forcePolling || query.state.data?.status === "running" ? 1200 : false,
  });
}
