import Fuse from "fuse.js";

import type { IProduct } from "../types/Product";

const STOP_WORDS = new Set([
  "a",
  "al",
  "con",
  "de",
  "del",
  "el",
  "en",
  "la",
  "las",
  "los",
  "o",
  "para",
  "por",
  "un",
  "una",
  "unos",
  "unas",
  "y",
]);

const TOKEN_EQUIVALENTS: Record<string, string[]> = {
  cafe: ["cafes", "cafecito"],
  instantaneo: ["instantanea", "instantaneos", "inst", "ints", "soluble"],
  inst: ["instantaneo", "instantanea", "ints", "soluble"],
  ints: ["instantaneo", "instantanea", "inst", "soluble"],
  crema: ["cremas"],
  cara: ["facial", "piel", "rostro"],
  piel: ["cara", "facial", "rostro"],
  facial: ["cara", "piel", "rostro"],
  shampoo: ["champu"],
  champu: ["shampoo"],
  jabon: ["jabon"],
  desodorante: ["deodorant", "deo"],
};

const toSafeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value == null) return "";
  if (Array.isArray(value)) {
    return value.map((item) => toSafeString(item)).join(" ");
  }
  if (typeof value === "object") {
    const named = (value as { name?: unknown }).name;

    if (typeof named === "string") return named;
  }

  return "";
};

const normalize = (value: unknown) =>
  toSafeString(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const singularize = (token: string) => {
  if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);

  return token;
};

const tokenize = (value: unknown) =>
  normalize(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token))
    .map(singularize);

const expandToken = (token: string): string[] => {
  const normalizedToken = singularize(normalize(token));
  const equivalents = TOKEN_EQUIVALENTS[normalizedToken] || [];
  const expanded = new Set([normalizedToken, ...equivalents.map(singularize)]);

  return Array.from(expanded);
};

type SearchableProduct = {
  id: string;
  product: IProduct;
  name: string;
  description: string;
  categories: string;
  sku: string;
  allText: string;
};

const toSearchableProduct = (product: IProduct): SearchableProduct => {
  const categoryText = [
    product.mainCategory || "",
    ...(product.subcategories || []),
    ...product.categories.map((category) => category?.name),
  ]
    .filter(Boolean)
    .join(" ");

  const name = normalize(product.name || "");
  const description = normalize(product.description || "");
  const categories = normalize(categoryText);
  const sku = normalize(product.sku || "");
  const allText = [name, description, categories, sku].filter(Boolean).join(" ");

  return {
    id: product.id,
    product,
    name,
    description,
    categories,
    sku,
    allText,
  };
};

const buildFuseQuery = (rawQuery: string) => {
  const tokens = tokenize(rawQuery);

  if (!tokens.length) return "";

  const allVariants = tokens.flatMap((token) => expandToken(token));
  const uniqueVariants = Array.from(new Set(allVariants));

  return uniqueVariants.join(" ");
};

export const smartSearchProducts = (products: IProduct[], rawQuery: string) => {
  const cleanQuery = normalize(rawQuery);

  if (!cleanQuery) return products;

  const searchableProducts = products.map(toSearchableProduct);
  const fuseQuery = buildFuseQuery(cleanQuery);

  if (!fuseQuery) return products;

  const fuse = new Fuse(searchableProducts, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.42,
    minMatchCharLength: 2,
    keys: [
      { name: "name", weight: 0.5 },
      { name: "categories", weight: 0.25 },
      { name: "description", weight: 0.2 },
      { name: "sku", weight: 0.05 },
    ],
  });

  return fuse
    .search(fuseQuery)
    .map((result) => result.item.product)
    .filter((product, index, self) => {
      return self.findIndex((item) => item.id === product.id) === index;
    });
};
