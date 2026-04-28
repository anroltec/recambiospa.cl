"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";

const PRODUCTS_PER_PAGE = 20;

export default function CollectionGrid({ products }: { products: Product[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  return (
    <>
      <div className="bg-white border border-gray-200 px-4 py-3 mb-4 text-sm text-dark/60">
        Mostrando{" "}
        {Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, products.length)}-
        {Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)} de{" "}
        {products.length} productos
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {paginatedProducts.map((product) => (
          <Link
            key={product.code}
            href={`/producto/${product.code}`}
            className="bg-white border border-gray-200 group hover:shadow-lg hover:border-primary/30 transition-all duration-200"
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
            <div className="p-3">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h3 className="text-sm font-medium text-dark leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
                {product.name}
              </h3>
              <p className="text-xs text-steel mb-2">SKU: {product.code}</p>
              {product.price ? (
                <div>
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                  <p className="text-xs text-steel">+ IVA</p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-dark/50">Consultar precio</p>
              )}
            </div>
          </Link>
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`w-11 h-11 flex items-center justify-center border text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary border-primary text-white"
                  : "border-gray-200 bg-white text-dark/70 hover:border-primary hover:text-primary"
              }`}
            >
              {page}
            </button>
          ))}
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
  );
}
