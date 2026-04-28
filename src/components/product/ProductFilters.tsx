"use client";

import { ChevronDown } from "lucide-react";
import type { Category } from "@/types/product";
import type { ProductFilters as Filters } from "@/types/product";
import { countByCategory, countByBrand } from "@/lib/filters";
import type { Product } from "@/types/product";

interface ProductFiltersProps {
  products: Product[];
  categories: Category[];
  brands: string[];
  filters: Filters;
  onCategoryChange: (id: string) => void;
  onBrandChange: (brand: string) => void;
}

interface SectionProps {
  title: string;
  items: { id: string; label: string; count: number }[];
  selected: string;
  onSelect: (id: string) => void;
}

function FilterSection({ title, items, selected, onSelect }: SectionProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex items-center justify-between w-full text-sm font-bold text-dark uppercase tracking-wide mb-3">
        {title}
        <ChevronDown size={14} />
      </button>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect("")}
            className={`w-full text-left text-xs py-1 transition-colors ${
              selected === "" ? "text-primary font-bold" : "text-gray-600 hover:text-primary"
            }`}
          >
            Todos
          </button>
        </li>
        {items.map(({ id, label, count }) => (
          <li key={id}>
            <button
              onClick={() => onSelect(id)}
              className={`w-full text-left text-xs py-1 flex items-center justify-between transition-colors ${
                selected === id ? "text-primary font-bold" : "text-gray-600 hover:text-primary"
              }`}
            >
              <span>{label}</span>
              <span className="text-gray-400">({count})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductFilters({
  products,
  categories,
  brands,
  filters,
  onCategoryChange,
  onBrandChange,
}: ProductFiltersProps) {
  const catCounts = countByCategory(products);
  const brandCounts = countByBrand(products);

  const categoryItems = categories
    .filter((c) => catCounts[c.id] > 0)
    .map((c) => ({ id: c.id, label: c.name, count: catCounts[c.id] }));

  const brandItems = brands
    .filter((b) => brandCounts[b] > 0)
    .map((b) => ({ id: b, label: b, count: brandCounts[b] }));

  return (
    <aside className="w-full">
      <FilterSection
        title="Categorías"
        items={categoryItems}
        selected={filters.category}
        onSelect={onCategoryChange}
      />
      <FilterSection
        title="Marcas"
        items={brandItems}
        selected={filters.brand}
        onSelect={onBrandChange}
      />
    </aside>
  );
}
