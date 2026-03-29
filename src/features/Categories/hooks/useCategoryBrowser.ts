import type { RootState } from "@/store/store";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  buildCategoryTree,
  flattenDescendants,
  normalizeText,
} from "../utils/categoryTree";

import { useCategories } from "@/features/Products/hooks/useCategory";
import { useStorefrontSettings } from "@/features/Settings/hooks/useStorefrontSettings";
import {
  expandBlockedCategoryIds,
  filterVisibleCategories,
} from "@/features/Products/utils/categoryVisibility";

export const useCategoryBrowser = () => {
  const [search, setSearch] = useState("");
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const { data: categories = [], isLoading } = useCategories();
  const { data: storefrontSettings } = useStorefrontSettings();
  const localBlockedCategoryIds = useSelector(
    (state: RootState) => state.settings.blockedCategoryIds || [],
  );

  const rawBlockedCategoryIds = storefrontSettings?.blockedCategoryIds?.length
    ? storefrontSettings.blockedCategoryIds
    : localBlockedCategoryIds;

  const blockedCategoryIds = useMemo(
    () => expandBlockedCategoryIds(categories, rawBlockedCategoryIds),
    [categories, rawBlockedCategoryIds],
  );

  const visibleCategories = useMemo(
    () => filterVisibleCategories(categories, blockedCategoryIds),
    [categories, blockedCategoryIds],
  );

  const rootCategories = useMemo(
    () => buildCategoryTree(visibleCategories),
    [visibleCategories],
  );

  const selectedRoot = useMemo(() => {
    if (!rootCategories.length) return null;
    if (!selectedRootId) return rootCategories[0];

    return rootCategories.find((category) => category.id === selectedRootId);
  }, [rootCategories, selectedRootId]);

  const categoryItems = useMemo(() => {
    if (!selectedRoot) return [];

    const descendants = flattenDescendants(selectedRoot);
    const baseItems = descendants.length > 0 ? descendants : [selectedRoot];
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) return baseItems;

    return baseItems.filter((item) =>
      normalizeText(item.name).includes(normalizedSearch),
    );
  }, [selectedRoot, search]);

  return {
    categoryItems,
    isLoading,
    rootCategories,
    search,
    selectedRoot,
    setSearch,
    setSelectedRootId,
  };
};
