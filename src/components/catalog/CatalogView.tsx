"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronRight, Filter, LayoutGrid } from "lucide-react";
import { products, categories, brands } from "@/data/products";
import { useProductFilter } from "@/hooks/useProductFilter";
import { countByCategory } from "@/lib/filters";
import ProductGrid from "@/components/product/ProductGrid";
import ProductModal from "@/components/product/ProductModal";
import ProductFilters from "@/components/product/ProductFilters";
import type { Product } from "@/types/product";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "price-asc", label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
] as const;

interface CatalogViewProps {
  initialCategory?: string;
  initialBrand?: string;
  title?: string;
  breadcrumb?: { label: string };
}

function SidebarContent({
  filters, setSearch, setCategory, setBrand, clearFilters, hasActiveFilters,
}: {
  filters: ReturnType<typeof useProductFilter>["filters"];
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setBrand: (v: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const activeCount = [filters.category, filters.brand, filters.search].filter(Boolean).length;

  return (
    <div className="border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-primary" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filtros</span>
          {activeCount > 0 && (
            <span className="bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] text-white/40 hover:text-white transition-colors flex items-center gap-1"
          >
            <X size={9} /> Limpiar
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs pr-7 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {filters.search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
            >
              <X size={12} />
            </button>
          ) : (
            <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3">
        <ProductFilters
          products={products}
          categories={categories}
          brands={brands}
          filters={filters}
          onCategoryChange={setCategory}
          onBrandChange={setBrand}
        />
      </div>
    </div>
  );
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
    filters, filtered, hasActiveFilters,
    setCategory, setBrand, setSearch, setSortBy,
    clearFilters, clearFilter,
  } = useProductFilter(products, {
    category: initialCategory,
    brand: initialBrand,
    search: urlQ,
  });

  useEffect(() => {
    if (urlQ) setSearch(urlQ);
  }, [urlQ]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeFilterCount = [filters.category, filters.brand, filters.search].filter(Boolean).length;
  const catCounts = countByCategory(products);

  const categoryChips = [
    { id: "", name: "Todos", count: products.length },
    ...categories
      .filter((c) => (catCounts[c.id] ?? 0) > 0)
      .map((c) => ({ id: c.id, name: c.name, count: catCounts[c.id] })),
  ];

  return (
    <div className="min-h-screen bg-light">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 pt-4 pb-4 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight size={11} />
            {breadcrumb ? (
              <>
                <Link href="/collections" className="hover:text-white/70 transition-colors">Catálogo</Link>
                <ChevronRight size={11} />
                <span className="text-white/70">{breadcrumb.label}</span>
              </>
            ) : (
              <span className="text-white/70">Catálogo</span>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8">
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                <LayoutGrid size={12} />
                {products.length} referencias en catálogo
              </p>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {title}
              </h1>
            </div>

            {/* Hero search */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar nombre, SKU, marca..."
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15"
                />
                {filters.search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                ) : (
                  <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CHIPS ────────────────────────────── */}
      <div className="bg-primary-dark/90 border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0.5 overflow-x-auto scrollbar-none">
            {categoryChips.map(({ id, name, count }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`flex-shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-b-2 ${
                  filters.category === id
                    ? "border-primary text-white"
                    : "border-transparent text-white/40 hover:text-white/80"
                }`}
              >
                {name}
                <span
                  className={`ml-1.5 font-normal ${
                    filters.category === id ? "text-primary" : "text-white/25"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mr-1">
              Filtros activos:
            </span>
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wide">
                {categories.find((c) => c.id === filters.category)?.name}
                <button onClick={() => clearFilter("category")} className="hover:text-white/60 transition-colors">
                  <X size={10} />
                </button>
              </span>
            )}
            {filters.brand && (
              <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wide">
                {filters.brand}
                <button onClick={() => clearFilter("brand")} className="hover:text-white/60 transition-colors">
                  <X size={10} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 bg-dark text-white text-[10px] font-bold px-3 py-1.5">
                &ldquo;{filters.search}&rdquo;
                <button onClick={() => clearFilter("search")} className="hover:text-white/60 transition-colors">
                  <X size={10} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[10px] text-gray-400 hover:text-primary transition-colors underline"
            >
              Limpiar todo
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-16">
              <SidebarContent
                filters={filters}
                setSearch={setSearch}
                setCategory={setCategory}
                setBrand={setBrand}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 px-4 py-2.5">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-dark uppercase tracking-wide"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal size={14} />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  <span className="font-bold text-dark">{filtered.length}</span>
                  {" "}producto{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 hidden sm:block uppercase tracking-wide">Ordenar</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof filters.sortBy)}
                  className="text-xs border border-gray-200 px-3 py-1.5 text-dark focus:outline-none focus:border-primary bg-white font-medium"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
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

      {/* ── MOBILE FILTERS PANEL ──────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="bg-primary-dark flex items-center justify-between px-4 py-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-primary" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button onClick={() => setShowMobileFilters(false)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1">
              <SidebarContent
                filters={filters}
                setSearch={setSearch}
                setCategory={setCategory}
                setBrand={setBrand}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary text-white font-bold py-3 text-sm uppercase tracking-wider"
              >
                Ver {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
              </button>
            </div>
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
