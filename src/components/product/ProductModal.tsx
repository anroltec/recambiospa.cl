"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Phone, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.code);

  function adjustQuantity(delta: number) {
    setQuantity((current) => Math.max(1, current + delta));
  }

  async function handleAddToCart() {
    setIsAdding(true);

    try {
      await addItem(product, quantity);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="md:flex">
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
              {product.images.map((image, index) => (
                <button
                  key={image + index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 md:pl-0">
          <div className="flex items-center gap-2 mb-3">
            <Badge label={product.brand} />
            <Badge
              label={product.inStock ? "En stock" : "Sin stock"}
              variant={product.inStock ? "success" : "muted"}
            />
          </div>

          <h2 className="text-xl font-bold text-dark mb-2 leading-snug">{product.name}</h2>
          <p className="text-xs text-gray-400 mb-4">SKU: {product.code}</p>

          {product.price !== null ? (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-dark">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-400">+ IVA</span>
            </div>
          ) : (
            <p className="text-lg text-gray-500 italic mb-4">Sin compra online</p>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>
          )}

          {product.inStock && product.price !== null ? (
            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-dark">Cantidad:</span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1 || isAdding}
                    className="px-3 py-2 text-dark hover:bg-light disabled:opacity-30 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-dark">{quantity}</span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    disabled={isAdding}
                    className="px-3 py-2 text-dark hover:bg-light disabled:opacity-30 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <Button
                onClick={() => {
                  void handleAddToCart();
                }}
                fullWidth
                variant={justAdded ? "outline" : "primary"}
                className={justAdded ? "border-green-600 text-green-700" : ""}
              >
                {justAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} />
                    Agregado al carrito
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart size={16} />
                    {isAdding ? "Agregando..." : inCart ? "Agregar mas" : "Agregar al carrito"}
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 transition-colors mb-5"
            >
              <Phone size={18} />
              Consultar por WhatsApp
            </a>
          )}

          {Object.keys(product.specs).length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark mb-2">
                Especificaciones
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-1.5 text-gray-500 w-1/2">{key}</td>
                      <td className="py-1.5 font-medium text-dark">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link
            href={`/producto/${product.code}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-primary hover:text-primary text-dark font-bold py-3 transition-colors"
          >
            Ver ficha completa
          </Link>
        </div>
      </div>
    </Modal>
  );
}
