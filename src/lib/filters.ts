import type { Product, ProductFilters } from "@/types/product";

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: ProductFilters["sortBy"]): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return (a.price ?? 0) - (b.price ?? 0);
      case "price-desc":
        return (b.price ?? 0) - (a.price ?? 0);
    }
  });
}

export function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
}

export function countByBrand(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] ?? 0) + 1;
    return acc;
  }, {});
}
