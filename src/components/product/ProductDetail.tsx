"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Check, Minus, Plus, Phone } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.code);

  function handleAddToCart() {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function adjustQuantity(delta: number) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex gap-12">

        {/* ── Image gallery ── */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="relative aspect-square bg-gray-50 border border-gray-100 mb-3">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-200">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 border-2 transition-colors flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="md:w-1/2">
          <div className="flex items-center gap-2 mb-3">
            <Badge label={product.brand} />
            <Badge
              label={product.inStock ? "En Stock" : "Sin Stock"}
              variant={product.inStock ? "success" : "muted"}
            />
          </div>

          <h1 className="text-2xl font-bold text-dark leading-snug mb-2">
            {product.name}
          </h1>
          <p className="text-xs text-gray-400 mb-5">SKU: {product.code}</p>

          {product.price !== null ? (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-dark">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-400">+ IVA</span>
            </div>
          ) : (
            <p className="text-xl text-gray-400 italic mb-1">Precio a consultar</p>
          )}

          {product.price !== null && (
            <p className="text-xs text-gray-400 mb-6">
              Total con IVA: {formatPrice(Math.round(product.price * 1.19))}
            </p>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Quantity + Add to cart */}
          {product.inStock && product.price !== null ? (
            <div className="space-y-3 mb-6">
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
                  <span className="w-10 text-center text-sm font-bold text-dark">
                    {quantity}
                  </span>
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
                size="lg"
                variant={justAdded ? "outline" : "primary"}
                className={justAdded ? "border-green-600 text-green-700" : ""}
              >
                {justAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={18} /> Agregado al carrito
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
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
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 mb-6 transition-colors"
            >
              <Phone size={18} />
              Consultar por WhatsApp
            </a>
          )}

          {/* Specs table */}
          {Object.keys(product.specs).length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-dark mb-3 pb-2 border-b border-gray-200">
                Ficha Técnica
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? "bg-light" : "bg-white"}>
                      <td className="py-2 px-3 text-gray-500 w-2/5">{key}</td>
                      <td className="py-2 px-3 font-medium text-dark">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
