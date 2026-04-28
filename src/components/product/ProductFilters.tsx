"use client";

import { useState } from "react";
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
  defaultOpen?: boolean;
}

function FilterSection({ title, items, selected, onSelect, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-3 text-[10px] font-bold text-dark uppercase tracking-wider"
      >
        <span className="flex items-center gap-2">
          {title}
          {selected && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          )}
        </span>
        <ChevronDown
          size={13}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="pb-3 space-y-0.5">
          <li>
            <button
              onClick={() => onSelect("")}
              className={`w-full text-left text-xs py-1.5 px-2 transition-colors flex items-center justify-between ${
                selected === ""
                  ? "bg-primary/5 text-primary font-bold"
                  : "text-gray-500 hover:text-dark hover:bg-gray-50"
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] text-gray-300 font-normal">{items.reduce((a, b) => a + b.count, 0)}</span>
            </button>
          </li>
          {items.map(({ id, label, count }) => (
            <li key={id}>
              <button
                onClick={() => onSelect(id)}
                className={`w-full text-left text-xs py-1.5 px-2 flex items-center justify-between transition-colors ${
                  selected === id
                    ? "bg-primary/5 text-primary font-bold"
                    : "text-gray-500 hover:text-dark hover:bg-gray-50"
                }`}
              >
                <span className="truncate pr-2">{label}</span>
                <span className={`text-[10px] font-normal flex-shrink-0 ${selected === id ? "text-primary/50" : "text-gray-300"}`}>
                  {count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProductFilters({
  products, categories, brands, filters, onCategoryChange, onBrandChange,
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
        defaultOpen={true}
      />
      <FilterSection
        title="Marcas"
        items={brandItems}
        selected={filters.brand}
        onSelect={onBrandChange}
        defaultOpen={true}
      />
    </aside>
  );
}
