"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ProductModal from "@/components/product/ProductModal";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/types/product";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

interface CatalogListingProps {
  products: Product[];
  categories: Category[];
  brands: string[];
  initialCategory?: string;
  initialBrand?: string;
}

export default function CatalogListing({
  products,
  categories,
  brands,
  initialCategory = "",
  initialBrand = "",
}: CatalogListingProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const { addItem, isInCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(initialBrand || searchParams.get("brand") || "");
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ categories: true, brands: true });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [justAddedCode, setJustAddedCode] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...products]
      .filter((product) => (selectedCategory ? product.category === selectedCategory : true))
      .filter((product) => (selectedBrand ? product.brand === selectedBrand : true))
      .filter((product) => {
        if (!query) return true;

        return (
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
        );
      })
      .sort((left, right) => {
        switch (sortBy) {
          case "name-asc":
            return left.name.localeCompare(right.name);
          case "name-desc":
            return right.name.localeCompare(left.name);
          case "price-asc":
            return (left.price ?? Number.POSITIVE_INFINITY) - (right.price ?? Number.POSITIVE_INFINITY);
          case "price-desc":
            return (right.price ?? 0) - (left.price ?? 0);
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedBrand, selectedCategory, sortBy]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};

    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });

    return counts;
  }, [products]);

  const brandCount = useMemo(() => {
    const counts: Record<string, number> = {};

    products.forEach((product) => {
      counts[product.brand] = (counts[product.brand] || 0) + 1;
    });

    return counts;
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [currentPage, filteredProducts]);

  const activeFilterCount = [selectedCategory, selectedBrand, searchQuery.trim()].filter(Boolean).length;
  const currentCategoryName = categories.find((category) => category.id === selectedCategory)?.name;
  const currentContextLabel = currentCategoryName || selectedBrand || null;
  const breadcrumbItems = currentContextLabel
    ? [
        { label: "Inicio", href: "/" },
        { label: "Catalogo", href: "/collections" },
        { label: currentContextLabel },
      ]
    : [
        { label: "Inicio", href: "/" },
        { label: "Catalogo" },
      ];

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const handleBrandChange = useCallback((value: string) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const handleGridAddToCart = useCallback(
    async (product: Product) => {
      await addItem(product, 1);
      setJustAddedCode(product.code);
      window.setTimeout(() => {
        setJustAddedCode((current) => (current === product.code ? null : current));
      }, 2000);
    },
    [addItem]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
    setSortBy("name-asc");
    setCurrentPage(1);
  }, []);

  const sidebar = (
    <div className="space-y-1">
      <div className="bg-white border border-gray-200 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en catalogo..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 pr-8 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-steel" />
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <button
          onClick={() =>
            setExpandedSections((current) => ({
              ...current,
              categories: !current.categories,
            }))
          }
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-dark uppercase tracking-wide hover:bg-light transition-colors"
        >
          Categorias
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.categories ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.categories && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => handleCategoryChange("")}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-light ${
                !selectedCategory ? "bg-primary/5 text-primary font-semibold" : "text-dark/80"
              }`}
            >
              <span className="flex items-center gap-2">
                <ChevronRight size={12} />
                Todos los productos
              </span>
              <span className="text-xs text-steel">{products.length}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(selectedCategory === category.id ? "" : category.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-light ${
                  selectedCategory === category.id ? "bg-primary/5 text-primary font-semibold" : "text-dark/80"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </span>
                <span className="text-xs text-steel">{categoryCount[category.id] || 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200">
        <button
          onClick={() =>
            setExpandedSections((current) => ({
              ...current,
              brands: !current.brands,
            }))
          }
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
                onClick={() => handleBrandChange(selectedBrand === brand ? "" : brand)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-light ${
                  selectedBrand === brand ? "bg-primary/5 text-primary font-semibold" : "text-dark/80"
                }`}
              >
                <span>{brand}</span>
                <span className="text-xs text-steel">{brandCount[brand] || 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <X size={14} />
          Limpiar filtros ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={breadcrumbItems}
        eyebrow={
          <>
            <LayoutGrid size={12} />
            {products.length} referencias en catalogo
          </>
        }
        title={currentContextLabel || "Catalogo de Productos"}
        description={
          <>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </>
        }
        actions={
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar nombre, SKU, marca..."
              className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15"
            />
            {searchQuery ? (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X size={15} />
              </button>
            ) : (
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
            )}
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters((current) => !current)}
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
          <aside className="hidden md:block w-64 flex-shrink-0">{sidebar}</aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-dark/60">
                Mostrando{" "}
                {Math.min((currentPage - 1) * productsPerPage + 1, filteredProducts.length)}
                -
                {Math.min(currentPage * productsPerPage, filteredProducts.length)} de{" "}
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-3">
                <label className="text-sm text-dark/60 hidden sm:block">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(event) => handleSortChange(event.target.value as SortOption)}
                  className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {currentCategoryName}
                    <button onClick={() => handleCategoryChange("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {selectedBrand}
                    <button onClick={() => handleBrandChange("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => handleSearchChange("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.code}
                      className="bg-white border border-gray-200 group hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {product.inStock && product.price !== null && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 uppercase">
                            En stock
                          </span>
                        )}
                        {product.price === null && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 uppercase">
                            Catalogo
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-sm font-medium text-dark leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-steel mb-2">SKU: {product.code}</p>
                        {product.price !== null ? (
                          <div>
                            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                            <p className="text-xs text-steel">+ IVA</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-dark/50">Consultar precio</p>
                        )}
                        <button
                          className="w-full mt-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 transition-colors"
                          onClick={(event) => {
                            event.stopPropagation();

                            if (product.inStock && product.price !== null) {
                              void handleGridAddToCart(product);
                              return;
                            }

                            setSelectedProduct(product);
                          }}
                        >
                          {product.inStock && product.price !== null
                            ? justAddedCode === product.code
                              ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                  <Check size={14} />
                                  Agregado
                                </span>
                              )
                              : isInCart(product.code)
                                ? "Agregar mas"
                                : "Agregar al carrito"
                            : "Cotizar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        setCurrentPage((page) => Math.max(1, page - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="w-11 h-11 flex items-center justify-center border border-gray-200 bg-white text-dark/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (page) =>
                          totalPages <= 7 ||
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .reduce<(number | "...")[]>((pages, page, index, source) => {
                        if (index > 0 && page - (source[index - 1] as number) > 1) {
                          pages.push("...");
                        }

                        pages.push(page);
                        return pages;
                      }, [])
                      .map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="w-11 h-11 flex items-center justify-center text-dark/40 text-sm"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page as number);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
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
                      onClick={() => {
                        setCurrentPage((page) => Math.min(totalPages, page + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
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
                <h3 className="text-lg font-semibold text-dark mb-2">No se encontraron productos</h3>
                <p className="text-sm text-steel mb-4">
                  Intenta ajustar los filtros o la busqueda
                </p>
                <button onClick={clearFilters} className="text-sm text-primary font-semibold hover:underline">
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
