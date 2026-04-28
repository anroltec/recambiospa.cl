"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal, X, LayoutGrid, ShoppingCart, Check, Minus, Plus, Phone } from "lucide-react";
import { products, categories, brands, formatPrice, type Product } from "@/data/products";
import PageHero from "@/components/ui/PageHero";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.code);

  function adjustQuantity(delta: number) {
    setQuantity((current) => Math.max(1, current + delta));
  }

  function handleAddToCart() {
    addItem(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 transition-colors rounded-full shadow-md"
          aria-label="Cerrar"
        >
          <X size={20} className="text-dark" />
        </button>

        <div className="md:flex">
          {/* Gallery */}
          <div className="md:w-1/2 p-6">
            <div className="relative aspect-square bg-gray-50 border border-gray-100 mb-3">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 border-2 flex-shrink-0 bg-gray-50 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 md:pl-2">
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">{product.brand}</p>
            <h2 className="text-xl font-bold text-dark leading-tight mb-2">{product.name}</h2>
            <p className="text-sm text-steel mb-4">SKU: {product.code}</p>

            {product.price ? (
              <div className="mb-5">
                <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                <p className="text-xs text-steel">+ IVA</p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-dark/50 mb-5">Consultar precio</p>
            )}

            <div className="mb-5">
              <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">Descripción</h3>
              <p className="text-sm text-dark/70 leading-relaxed">{product.description}</p>
            </div>

            {Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">Ficha Técnica</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-2 px-3 font-medium text-dark/70 w-2/5">{key}</td>
                        <td className="py-2 px-3 text-dark">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {product.inStock && product.price !== null ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-dark">Cantidad:</span>
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-dark hover:bg-light disabled:opacity-30 transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-dark">{quantity}</span>
                    <button
                      onClick={() => adjustQuantity(1)}
                      className="px-3 py-2 text-dark hover:bg-light transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  fullWidth
                  variant={justAdded ? "outline" : "primary"}
                  className={justAdded ? "border-green-600 text-green-700" : ""}
                >
                  {justAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={16} /> Agregado al carrito
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      {inCart ? "Agregar más" : "Agregar al carrito"}
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 transition-colors"
              >
                <Phone size={18} />
                Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CatalogListingProps {
  initialCategory?: string;
  initialBrand?: string;
}

export default function CatalogListing({ initialCategory = "", initialBrand = "" }: CatalogListingProps) {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const { addItem, isInCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    initialBrand || searchParams.get("brand") || ""
  );
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ categories: true, brands: true });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [justAddedCode, setJustAddedCode] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrand)   result = result.filter((p) => p.brand === selectedBrand);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":   return a.name.localeCompare(b.name);
        case "name-desc":  return b.name.localeCompare(a.name);
        case "price-asc":  return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "price-desc": return (b.price ?? 0) - (a.price ?? 0);
        default: return 0;
      }
    });
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const categoryCount = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, []);

  const brandCount = useMemo(() => {
    const c: Record<string, number> = {};
    products.forEach((p) => { c[p.brand] = (c[p.brand] || 0) + 1; });
    return c;
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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
  const handleGridAddToCart = useCallback((product: Product) => {
    addItem(product, 1);
    setJustAddedCode(product.code);
    window.setTimeout(() => setJustAddedCode((current) => (current === product.code ? null : current)), 2000);
  }, [addItem]);
  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
    setSortBy("name-asc");
    setCurrentPage(1);
  }, []);
  const handleCloseModal = useCallback(() => setSelectedProduct(null), []);
  const activeFilterCount = [selectedCategory, selectedBrand, searchQuery.trim()].filter(Boolean).length;
  const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name;
  const currentContextLabel = currentCategoryName ?? selectedBrand;
  const breadcrumbItems = currentContextLabel
    ? [
        { label: "Inicio", href: "/" },
        { label: "Cat\u00e1logo", href: "/collections" },
        { label: currentContextLabel },
      ]
    : [
        { label: "Inicio", href: "/" },
        { label: "Cat\u00e1logo" },
      ];

  const sidebar = (
    <div className="space-y-1">
      {/* Search */}
      <div className="p-4 bg-white border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-steel" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200">
        <button
          onClick={() => setExpandedSections((p) => ({ ...p, categories: !p.categories }))}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-dark uppercase tracking-wide hover:bg-light transition-colors"
        >
          Categorías
          <ChevronDown size={16} className={`transition-transform ${expandedSections.categories ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.categories && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => handleCategoryChange("")}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-light transition-colors ${
                !selectedCategory ? "text-primary font-semibold bg-primary/5" : "text-dark/80"
              }`}
            >
              <span className="flex items-center gap-2"><ChevronRight size={12} />Todos los productos</span>
              <span className="text-xs text-steel">{products.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(selectedCategory === cat.id ? "" : cat.id)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-light transition-colors ${
                  selectedCategory === cat.id ? "text-primary font-semibold bg-primary/5" : "text-dark/80"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
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
          onClick={() => setExpandedSections((p) => ({ ...p, brands: !p.brands }))}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-dark uppercase tracking-wide hover:bg-light transition-colors"
        >
          Marcas
          <ChevronDown size={16} className={`transition-transform ${expandedSections.brands ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.brands && (
          <div className="border-t border-gray-100">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(selectedBrand === brand ? "" : brand)}
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

      {/* Clear */}
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
      {/* Header */}
      <PageHero
        breadcrumbs={breadcrumbItems}
        eyebrow={
          <>
            <LayoutGrid size={12} />
            {products.length} referencias en catálogo
          </>
        }
        title={currentContextLabel ?? "Catálogo de Productos"}
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
              onChange={(e) => handleSearchChange(e.target.value)}
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
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 text-sm font-medium text-dark"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </button>
          {showMobileFilters && <div className="mt-2">{sidebar}</div>}
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0">{sidebar}</aside>

          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-dark/60">
                Mostrando {Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, filteredProducts.length)}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-3">
                <label className="text-sm text-dark/60 hidden sm:block">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {currentCategoryName}
                    <button onClick={() => handleCategoryChange("")}><X size={12} /></button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    {selectedBrand}
                    <button onClick={() => handleBrandChange("")}><X size={12} /></button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="bg-white border border-primary/30 text-primary text-sm px-3 py-1 flex items-center gap-1.5">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => handleSearchChange("")}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
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
                        {product.inStock && product.price && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 uppercase">En stock</span>
                        )}
                        {!product.price && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 uppercase">Catálogo</span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
                        <h3 className="text-sm font-medium text-dark leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
                        <p className="text-xs text-steel mb-2">SKU: {product.code}</p>
                        {product.price ? (
                          <div>
                            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                            <p className="text-xs text-steel">+ IVA</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-dark/50">Consultar precio</p>
                        )}
                        <button
                          className="w-full mt-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.inStock && product.price !== null) {
                              handleGridAddToCart(product);
                              return;
                            }
                            setSelectedProduct(product);
                          }}
                        >
                          {product.inStock && product.price !== null
                            ? justAddedCode === product.code
                              ? "Agregado"
                              : isInCart(product.code)
                                ? "Agregar más"
                                : "Agregar al carrito"
                            : "Cotizar"}
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
                      .filter((p) => totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((page, idx) =>
                        page === "..." ? (
                          <span key={`d-${idx}`} className="w-11 h-11 flex items-center justify-center text-dark/40 text-sm">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className={`w-11 h-11 flex items-center justify-center border text-sm font-medium transition-colors ${
                              currentPage === page ? "bg-primary border-primary text-white" : "border-gray-200 bg-white text-dark/70 hover:border-primary hover:text-primary"
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
                <h3 className="text-lg font-semibold text-dark mb-2">No se encontraron productos</h3>
                <p className="text-sm text-steel mb-4">Intenta ajustar los filtros o la búsqueda</p>
                <button onClick={clearFilters} className="text-sm text-primary font-semibold hover:underline">
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
}
