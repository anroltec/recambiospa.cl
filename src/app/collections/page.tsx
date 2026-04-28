"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import { products, categories, brands, formatPrice, type Product } from "@/data/products";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 transition-colors rounded-full shadow-md"
          aria-label="Cerrar"
        >
          <X size={20} className="text-dark" />
        </button>

        <div className="md:flex">
          {/* Image gallery */}
          <div className="md:w-1/2 p-6">
            {/* Main image */}
            <div className="relative aspect-square bg-gray-50 border border-gray-100 mb-3">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 border-2 flex-shrink-0 bg-gray-50 transition-colors ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} vista ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="md:w-1/2 p-6 md:pl-2">
            {/* Brand */}
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h2 className="text-xl font-bold text-dark leading-tight mb-2">
              {product.name}
            </h2>

            {/* SKU */}
            <p className="text-sm text-steel mb-4">
              SKU: {product.code}
            </p>

            {/* Price */}
            {product.price ? (
              <div className="mb-5">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-steel">+ IVA</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-dark/50 mb-5">
                Consultar precio
              </p>
            )}

            {/* Description */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">
                Descripci&oacute;n
              </h3>
              <p className="text-sm text-dark/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specs table */}
            {Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">
                  Ficha T&eacute;cnica
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="py-2 px-3 font-medium text-dark/70 w-2/5">
                          {key}
                        </td>
                        <td className="py-2 px-3 text-dark">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CTA Button */}
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 text-sm uppercase tracking-wide transition-colors">
              {product.price ? "Agregar al carro" : "Cotizar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense>
      <CollectionsContent />
    </Suspense>
  );
}

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    searchParams.get("brand")
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const brandCount = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery("");
  };

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const activeFilterCount = [selectedCategory, selectedBrand, searchQuery.trim()].filter(Boolean).length;

  const sidebar = (
    <div className="space-y-1">
      {/* Search within results */}
      <div className="p-4 bg-white border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en cat&aacute;logo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-steel" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-dark uppercase tracking-wide hover:bg-light transition-colors"
        >
          Categor&iacute;as
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.categories ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.categories && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-light transition-colors ${
                !selectedCategory ? "text-primary font-semibold bg-primary/5" : "text-dark/80"
              }`}
            >
              <span className="flex items-center gap-2">
                <ChevronRight size={12} />
                Todos los productos
              </span>
              <span className="text-xs text-steel">{products.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-light transition-colors ${
                  selectedCategory === cat.id ? "text-primary font-semibold bg-primary/5" : "text-dark/80"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
                <span className="text-xs text-steel">{categoryCount[cat.id] || 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="bg-white border border-gray-200">
        <button
          onClick={() => toggleSection("brands")}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-dark uppercase tracking-wide hover:bg-light transition-colors"
        >
          Marcas
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.brands ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.brands && (
          <div className="border-t border-gray-100">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-light transition-colors ${
                  selectedBrand === brand ? "text-primary font-semibold bg-primary/5" : "text-dark/80"
                }`}
              >
                <span>{brand}</span>
                <span className="text-xs text-steel">{brandCount[brand] || 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full bg-white border border-gray-200 px-4 py-3 text-sm text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <X size={14} />
          Limpiar filtros ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-light min-h-screen">
      {/* Page header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Cat&aacute;logo</span>
            {selectedCategory && (
              <>
                <ChevronRight size={14} />
                <span className="text-white">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : "Cat\u00e1logo de Productos"}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 text-sm font-medium text-dark"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {showMobileFilters && <div className="mt-2">{sidebar}</div>}
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">{sidebar}</aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="bg-white border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-dark/60">
                Mostrando {Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, filteredProducts.length)}-{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-3">
                <label className="text-sm text-dark/60 hidden sm:block">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Active filters pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand(null)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.code}
                      className="bg-white border border-gray-200 group hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {/* Product image */}
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {product.inStock && product.price && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 uppercase">
                            En stock
                          </span>
                        )}
                        {!product.price && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 uppercase">
                            Cat&aacute;logo
                          </span>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="p-3">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-sm font-medium text-dark leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-steel mb-2">
                          SKU: {product.code}
                        </p>
                        {product.price ? (
                          <div>
                            <p className="text-lg font-bold text-primary">
                              {formatPrice(product.price)}
                            </p>
                            <p className="text-xs text-steel">+ IVA</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-dark/50">
                            Consultar precio
                          </p>
                        )}
                        <button
                          className="w-full mt-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                        >
                          {product.price ? "Agregar al carro" : "Cotizar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1">
                    <button
                      onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === 1}
                      className="w-11 h-11 flex items-center justify-center border border-gray-200 bg-white text-dark/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                        if (idx > 0 && page - (arr[idx - 1]) > 1) acc.push("...");
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((page, idx) =>
                        page === "..." ? (
                          <span key={`dots-${idx}`} className="w-11 h-11 flex items-center justify-center text-dark/40 text-sm">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className={`w-11 h-11 flex items-center justify-center border text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary border-primary text-white"
                                : "border-gray-200 bg-white text-dark/70 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === totalPages}
                      className="w-11 h-11 flex items-center justify-center border border-gray-200 bg-white text-dark/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-gray-200 py-16 text-center">
                <Search size={48} className="mx-auto text-steel/50 mb-4" />
                <h3 className="text-lg font-semibold text-dark mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-sm text-steel mb-4">
                  Intenta ajustar los filtros o la b&uacute;squeda
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}
