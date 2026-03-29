import type { ICategory } from "@/features/Products/types/Product";

export type CategoryNode = {
  id: string;
  name: string;
  parent?: string | null;
  children: CategoryNode[];
};

const ROOT_PRIORITY = [
  "OFERTAS",
  "ALMACÉN",
  "BEBIDAS",
  "LIMPIEZA",
  "PERFUMERÍA",
  "CONGELADOS",
];

export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const compareCategoryNames = (a: string, b: string) =>
  a.localeCompare(b, "es", { sensitivity: "base" });

const rootPriorityIndex = (name: string) => {
  const normalized = normalizeText(name);
  const index = ROOT_PRIORITY.findIndex(
    (item) => normalizeText(item) === normalized,
  );

  return index === -1 ? Number.POSITIVE_INFINITY : index;
};

export const buildCategoryTree = (categories: ICategory[]): CategoryNode[] => {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  categories.forEach((category) => {
    map.set(category.id, { ...category, children: [] });
  });

  categories.forEach((category) => {
    const node = map.get(category.id);

    if (!node) return;

    if (category.parent && map.has(category.parent)) {
      map.get(category.parent)?.children.push(node);

      return;
    }

    roots.push(node);
  });

  const sortNodes = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => compareCategoryNames(a.name, b.name));
    nodes.forEach((node) => {
      if (node.children.length > 0) sortNodes(node.children);
    });
  };

  sortNodes(roots);

  roots.sort((a, b) => {
    const priorityDiff = rootPriorityIndex(a.name) - rootPriorityIndex(b.name);

    if (priorityDiff !== 0) return priorityDiff;

    return compareCategoryNames(a.name, b.name);
  });

  return roots;
};

export const flattenDescendants = (node: CategoryNode): CategoryNode[] => {
  if (!node.children.length) return [];

  const allChildren = node.children.flatMap((child) => [
    child,
    ...flattenDescendants(child),
  ]);

  const uniqueById = new Map<string, CategoryNode>();

  allChildren.forEach((child) => {
    if (!uniqueById.has(child.id)) uniqueById.set(child.id, child);
  });

  return Array.from(uniqueById.values()).sort((a, b) =>
    compareCategoryNames(a.name, b.name),
  );
};

export const getCategoryInitials = (name: string) => {
  const words = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (words.length === 0) return "CM";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const getColorClassByName = (name: string) => {
  const normalized = normalizeText(name);
  let hash = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  const variants = [
    "from-amber-100 to-orange-50 text-amber-700",
    "from-cyan-100 to-sky-50 text-cyan-700",
    "from-lime-100 to-emerald-50 text-lime-700",
    "from-rose-100 to-pink-50 text-rose-700",
    "from-indigo-100 to-blue-50 text-indigo-700",
    "from-violet-100 to-purple-50 text-violet-700",
  ];

  return variants[Math.abs(hash) % variants.length];
};

export const getProductsByCategoryUrl = (name: string) =>
  `/products?categories=${encodeURIComponent(name)}`;
