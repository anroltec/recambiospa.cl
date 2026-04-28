"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { products, categories, brands } from "@/data/products";
import { useProductFilter } from "@/hooks/useProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import ProductModal from "@/components/product/ProductModal";
import ProductFilters from "@/components/product/ProductFilters";
import type { Product } from "@/types/product";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
] as const;

interface CatalogViewProps {
  initialCategory?: string;
  initialBrand?: string;
  title?: string;
  breadcrumb?: { label: string; href?: string };
}

export default function CatalogView({
  initialCategory = "",
  initialBrand = "",
  title = "Catálogo de Productos",
  breadcrumb,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") || "";

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    filters,
    filtered,
    hasActiveFilters,
    setCategory,
    setBrand,
    setSearch,
    setSortBy,
    clearFilters,
    clearFilter,
  } = useProductFilter(products, {
    category: initialCategory,
    brand: initialBrand,
    search: urlQ,
  });

  // Sync URL ?q param (e.g. from header search)
  useEffect(() => {
    if (urlQ) setSearch(urlQ);
  }, [urlQ]); // eslint-disable-line react-hooks/exhaustive-deps

  const sidebar = (
    <div className="space-y-1">
      <div className="p-4 bg-white border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <ProductFilters
          products={products}
          categories={categories}
          brands={brands}
          filters={filters}
          onCategoryChange={setCategory}
          onBrandChange={setBrand}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full bg-white border border-gray-200 px-4 py-3 text-sm text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <X size={14} />
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-light min-h-screen">
      {/* Page header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            {breadcrumb ? (
              <>
                <Link href="/collections" className="hover:text-white transition-colors">Catálogo</Link>
                <ChevronRight size={14} />
                <span className="text-white">{breadcrumb.label}</span>
              </>
            ) : (
              <span className="text-white">Catálogo</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.category && (
              <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 uppercase tracking-wide">
                {categories.find((c) => c.id === filters.category)?.name}
                <button onClick={() => clearFilter("category")}><X size={12} /></button>
              </span>
            )}
            {filters.brand && (
              <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 uppercase tracking-wide">
                {filters.brand}
                <button onClick={() => clearFilter("brand")}><X size={12} /></button>
              </span>
            )}
            {filters.search && (
              <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5">
                &ldquo;{filters.search}&rdquo;
                <button onClick={() => clearFilter("search")}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">{sidebar}</aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm text-dark font-medium"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={16} />
                  Filtros
                </button>
                <span className="text-sm text-gray-500">
                  {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof filters.sortBy)}
                className="text-sm border border-gray-300 px-3 py-1.5 text-dark focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <ProductGrid
              products={filtered}
              onProductClick={setSelectedProduct}
              emptyMessage="No se encontraron productos con esos filtros."
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-light overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-dark">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={20} />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
