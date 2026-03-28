type RankingWeightPreset = "suave" | "medio" | "fuerte";

const RANKING_WEIGHT_PRESET: RankingWeightPreset = "medio";

const PRESET_CONFIG: Record<
  RankingWeightPreset,
  {
    minRating: number;
    maxRating: number;
    maxRankForRating: number;
    curveExponent: number;
  }
> = {
  suave: {
    minRating: 4.1,
    maxRating: 5,
    maxRankForRating: 1500,
    curveExponent: 1.6,
  },
  medio: {
    minRating: 3.8,
    maxRating: 5,
    maxRankForRating: 1000,
    curveExponent: 1,
  },
  fuerte: {
    minRating: 3.2,
    maxRating: 5,
    maxRankForRating: 700,
    curveExponent: 0.65,
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getRatingFromTopSellerRank = (
  topSellerRank?: number | null,
): number | null => {
  if (topSellerRank === null || topSellerRank === undefined) return null;
  if (!Number.isFinite(topSellerRank) || topSellerRank <= 0) return null;

  const { minRating, maxRating, maxRankForRating, curveExponent } =
    PRESET_CONFIG[RANKING_WEIGHT_PRESET];
  const clampedRank = clamp(topSellerRank, 1, maxRankForRating);
  const normalized = (clampedRank - 1) / (maxRankForRating - 1);
  const weightedProgress = Math.pow(normalized, curveExponent);
  const rating = maxRating - weightedProgress * (maxRating - minRating);

  return Math.round(rating * 10) / 10;
};

export const getVisualStarsCount = (rating: number | null): number => {
  if (rating === null) return 0;
  return clamp(Math.round(rating), 1, 5);
};

export const getReviewCountFromTopSellerRank = (
  topSellerRank?: number | null,
): number | null => {
  if (topSellerRank === null || topSellerRank === undefined) return null;
  if (!Number.isFinite(topSellerRank) || topSellerRank <= 0) return null;

  return Math.max(10, Math.round(2200 / Math.sqrt(topSellerRank)));
};
