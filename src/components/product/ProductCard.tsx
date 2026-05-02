import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

function PlaceholderIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const image = product.images[0];

  const inner = (
    <div className="group bg-white overflow-hidden hover:shadow-md transition-all cursor-pointer">
      <div className="relative aspect-square bg-white flex items-center justify-center border-b border-gray-100 p-4">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <PlaceholderIcon />
        )}
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-gray-700 text-white text-[9px] font-bold uppercase px-1.5 py-0.5">
            Sin Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="text-xs font-bold text-dark leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[32px]">
          {product.name}
        </h3>
        <p className="text-[10px] text-gray-400 mt-1">SKU: {product.code}</p>
        {product.price !== null ? (
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-base font-bold text-dark">{formatPrice(product.price)}</span>
            <span className="text-[10px] text-gray-400">+ IVA</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-400 italic">Sin compra online</p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{inner}</button>;
  }

  return <Link href={`/producto/${product.code}`}>{inner}</Link>;
}
