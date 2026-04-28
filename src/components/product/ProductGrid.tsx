import { PackageSearch } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export default function ProductGrid({
  products,
  onProductClick,
  emptyMessage = "No se encontraron productos.",
  onClearFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 py-20 px-8 text-center">
        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <PackageSearch size={28} className="text-gray-300" />
        </div>
        <p className="font-bold text-dark text-sm mb-1">Sin resultados</p>
        <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">{emptyMessage}</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 uppercase tracking-wider transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.code}
          product={product}
          onClick={onProductClick ? () => onProductClick(product) : undefined}
        />
      ))}
    </div>
  );
}
