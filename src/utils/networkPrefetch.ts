type ConnectionWithHints = {
  effectiveType?: string;
  saveData?: boolean;
};

const getConnection = (): ConnectionWithHints | null => {
  if (typeof navigator === "undefined") return null;

  return (
    (navigator as Navigator & { connection?: ConnectionWithHints })
      .connection || null
  );
};

export const getLikelyPreloadLimit = () => {
  if (typeof navigator === "undefined") return 2;

  const connection = getConnection();
  const effectiveType = (connection?.effectiveType || "").toLowerCase();
  const saveData = Boolean(connection?.saveData);
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  if (saveData) return 0;
  if (effectiveType === "slow-2g" || effectiveType === "2g") return 0;
  if (effectiveType === "3g") return 1;
  if (typeof memory === "number" && memory <= 2) return 1;

  return 3;
};

export const canRunIdlePreload = () => getLikelyPreloadLimit() > 0;
