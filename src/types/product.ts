export interface Product {
  id?: string;
  handle?: string;
  variantId?: string | null;
  variantTitle?: string | null;
  code: string;
  name: string;
  category: string;
  categoryLabel?: string;
  brand: string;
  price: number | null;
  images: string[];
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Brand {
  name: string;
  logo: string;
  href: string;
}

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface ProductFilters {
  category: string;
  brand: string;
  search: string;
  sortBy: SortOption;
}
