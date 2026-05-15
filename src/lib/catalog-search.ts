import type { Product } from "@/types/product";

const COMBINING_MARKS_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;

type SearchableProduct = Pick<Product, "code" | "name" | "brand" | "category" | "categoryLabel">;

interface ProductSearchIndex {
  code: string;
  name: string;
  brand: string;
  category: string;
  text: string;
}

function buildProductSearchIndex(product: SearchableProduct): ProductSearchIndex {
  const code = normalizeCatalogSearchValue(product.code);
  const name = normalizeCatalogSearchValue(product.name);
  const brand = normalizeCatalogSearchValue(product.brand);
  const category = normalizeCatalogSearchValue(product.categoryLabel ?? product.category);

  return {
    code,
    name,
    brand,
    category,
    text: [code, name, brand, category].filter(Boolean).join(" "),
  };
}

function getCatalogSearchScore(product: SearchableProduct, normalizedQuery: string): number {
  const index = buildProductSearchIndex(product);
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  if (tokens.length === 0) {
    return -1;
  }

  if (index.code === normalizedQuery) {
    return 1000;
  }

  if (index.name === normalizedQuery) {
    return 980;
  }

  if (index.name.startsWith(normalizedQuery)) {
    return 940;
  }

  if (index.code.startsWith(normalizedQuery)) {
    return 930;
  }

  if (index.brand === normalizedQuery) {
    return 920;
  }

  if (index.brand.startsWith(normalizedQuery)) {
    return 910;
  }

  let score = -1;

  if (index.name.includes(normalizedQuery)) {
    score = Math.max(score, 900 - index.name.indexOf(normalizedQuery));
  }

  if (index.code.includes(normalizedQuery)) {
    score = Math.max(score, 890 - index.code.indexOf(normalizedQuery));
  }

  if (index.brand.includes(normalizedQuery)) {
    score = Math.max(score, 860 - index.brand.indexOf(normalizedQuery));
  }

  if (index.category.includes(normalizedQuery)) {
    score = Math.max(score, 840 - index.category.indexOf(normalizedQuery));
  }

  if (tokens.every((token) => index.text.includes(token))) {
    const tokenScore = tokens.reduce((sum, token) => {
      const position = index.text.indexOf(token);
      return sum + Math.max(0, 20 - position);
    }, 0);

    score = Math.max(score, 780 + tokenScore);
  }

  return score;
}

export function normalizeCatalogSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS_REGEX, "")
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_REGEX, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function matchesCatalogSearch(product: SearchableProduct, query: string): boolean {
  const normalizedQuery = normalizeCatalogSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const { text } = buildProductSearchIndex(product);
  return normalizedQuery.split(" ").every((token) => text.includes(token));
}

export function getCatalogExactProductMatch<T extends SearchableProduct>(
  products: T[],
  query: string
): T | null {
  const normalizedQuery = normalizeCatalogSearchValue(query);

  if (!normalizedQuery) {
    return null;
  }

  const exactCodeMatch =
    products.find((product) => normalizeCatalogSearchValue(product.code) === normalizedQuery) ?? null;

  if (exactCodeMatch) {
    return exactCodeMatch;
  }

  const exactNameMatches = products.filter(
    (product) => normalizeCatalogSearchValue(product.name) === normalizedQuery
  );

  return exactNameMatches.length === 1 ? exactNameMatches[0] : null;
}

export function getCatalogSearchSuggestions<T extends SearchableProduct>(
  products: T[],
  query: string,
  limit = 6
): T[] {
  const normalizedQuery = normalizeCatalogSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  return products
    .map((product) => ({
      product,
      score: getCatalogSearchScore(product, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const nameComparison = left.product.name.localeCompare(right.product.name);
      if (nameComparison !== 0) {
        return nameComparison;
      }

      return left.product.code.localeCompare(right.product.code);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}
