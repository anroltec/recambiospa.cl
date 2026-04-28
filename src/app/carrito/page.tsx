"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function CarritoPage() {
  const { items, totalQuantity, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-light min-h-screen">
        <Container className="py-20 text-center">
          <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-8">Agrega productos desde el catálogo.</p>
          <Link
            href="/collections"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 uppercase tracking-wider transition-colors"
          >
            Ver catálogo
          </Link>
        </Container>
      </div>
    );
  }

  const iva = Math.round(totalPrice * 0.19);
  const totalConIva = totalPrice + iva;

  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Carrito</span>
          </nav>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark uppercase tracking-wide">
            Carrito ({totalQuantity} {totalQuantity === 1 ? "producto" : "productos"})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 size={13} />
            Vaciar carrito
          </button>
        </div>

        <div className="lg:flex gap-8">
          {/* Items */}
          <div className="flex-1 space-y-3 mb-6 lg:mb-0">
            {items.map(({ product, quantity }) => {
              const image = product.images[0];
              return (
                <div key={product.code} className="bg-white border border-gray-200 p-4 flex gap-4">
                  {/* Image */}
                  <Link href={`/producto/${product.code}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 bg-gray-50 border border-gray-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingCart size={24} className="text-gray-200" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">
                      {product.brand}
                    </p>
                    <Link href={`/producto/${product.code}`}>
                      <h3 className="text-sm font-bold text-dark leading-snug hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-gray-400 mt-0.5">SKU: {product.code}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity control */}
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(product.code, quantity - 1)}
                          className="px-2 py-1.5 text-dark hover:bg-light disabled:opacity-30 transition-colors"
                          disabled={quantity <= 1}
                          aria-label="Reducir"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-dark">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.code, quantity + 1)}
                          className="px-2 py-1.5 text-dark hover:bg-light transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {product.price !== null ? (
                          <>
                            <p className="text-base font-bold text-dark">
                              {formatPrice(product.price * quantity)}
                            </p>
                            <p className="text-[10px] text-gray-400">+ IVA</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 italic">A consultar</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.code)}
                    className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors self-start"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-5 sticky top-24">
              <h2 className="font-bold text-dark uppercase tracking-wide mb-4 text-sm">
                Resumen del pedido
              </h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (neto)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (19%)</span>
                  <span>{formatPrice(iva)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-dark text-base">
                  <span>Total</span>
                  <span>{formatPrice(totalConIva)}</span>
                </div>
              </div>

              <Button fullWidth size="lg" className="mb-3">
                Proceder al checkout
              </Button>
              <Link
                href="/collections"
                className="block text-center text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                ← Seguir comprando
              </Link>

              <p className="text-[10px] text-gray-400 text-center mt-4">
                El checkout con pago online estará disponible próximamente.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
