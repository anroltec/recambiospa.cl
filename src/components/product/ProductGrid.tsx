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
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-primary font-bold text-sm underline hover:text-primary-dark"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
