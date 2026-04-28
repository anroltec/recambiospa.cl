"use client";

import { useState, useMemo } from "react";
import type { Product, ProductFilters, SortOption } from "@/types/product";
import { filterProducts, sortProducts } from "@/lib/filters";

const DEFAULT_FILTERS: ProductFilters = {
  category: "",
  brand: "",
  search: "",
  sortBy: "name-asc",
};

export function useProductFilter(
  products: Product[],
  initial?: Partial<ProductFilters>
) {
  const [filters, setFilters] = useState<ProductFilters>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const filtered = useMemo(() => {
    const result = filterProducts(products, filters);
    return sortProducts(result, filters.sortBy);
  }, [products, filters]);

  function setCategory(category: string) {
    setFilters((prev) => ({ ...prev, category }));
  }

  function setBrand(brand: string) {
    setFilters((prev) => ({ ...prev, brand }));
  }

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }));
  }

  function setSortBy(sortBy: SortOption) {
    setFilters((prev) => ({ ...prev, sortBy }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function clearFilter(key: keyof ProductFilters) {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
  }

  const hasActiveFilters =
    filters.category !== "" || filters.brand !== "" || filters.search !== "";

  return {
    filters,
    filtered,
    hasActiveFilters,
    setCategory,
    setBrand,
    setSearch,
    setSortBy,
    clearFilters,
    clearFilter,
  };
}
