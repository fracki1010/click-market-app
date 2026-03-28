import type { ICategory, IProduct } from "../types/Product";

const normalizeId = (value: string) => String(value).trim();

export const sanitizeSelectedCategories = (
  selectedCategories: string[] = [],
  blockedCategoryNames: string[] = [],
) => {
  const blockedNames = new Set(
    blockedCategoryNames.map((name) => name.trim().toLowerCase()),
  );

  return selectedCategories.filter(
    (name) => !blockedNames.has(name.trim().toLowerCase()),
  );
};

export const isCategoryBlocked = (
  category: Pick<ICategory, "id">,
  blockedCategoryIds: string[] = [],
) => {
  const blockedIds = new Set(blockedCategoryIds.map(normalizeId));
  return blockedIds.has(normalizeId(category.id));
};

export const expandBlockedCategoryIds = (
  categories: ICategory[] = [],
  blockedCategoryIds: string[] = [],
) => {
  const blocked = new Set(blockedCategoryIds.map(normalizeId));
  let changed = true;

  while (changed) {
    changed = false;
    categories.forEach((category) => {
      const parentId = category.parent ? normalizeId(category.parent) : null;
      const categoryId = normalizeId(category.id);
      if (parentId && blocked.has(parentId) && !blocked.has(categoryId)) {
        blocked.add(categoryId);
        changed = true;
      }
    });
  }

  return Array.from(blocked);
};

export const filterVisibleCategories = (
  categories: ICategory[],
  blockedCategoryIds: string[] = [],
) =>
  categories.filter(
    (category) => !isCategoryBlocked(category, blockedCategoryIds),
  );

export const isProductVisible = (
  product: IProduct,
  blockedCategoryIds: string[] = [],
) =>
  !product.isHidden &&
  !product.categories.some((category) =>
    isCategoryBlocked(category, blockedCategoryIds),
  );
