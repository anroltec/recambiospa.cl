"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <Modal onClose={onClose}>
      <div className="md:flex">
        {/* Image gallery */}
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
                  className={`relative w-16 h-16 border-2 transition-colors ${
                    selectedImage === idx ? "border-primary" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="md:w-1/2 p-6 md:pl-0">
          <div className="flex items-center gap-2 mb-3">
            <Badge label={product.brand} />
            <Badge label={product.inStock ? "En Stock" : "Sin Stock"} variant={product.inStock ? "success" : "muted"} />
          </div>

          <h2 className="text-xl font-bold text-dark mb-2 leading-snug">{product.name}</h2>
          <p className="text-xs text-gray-400 mb-4">SKU: {product.code}</p>

          {product.price !== null ? (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-dark">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-400">+ IVA</span>
            </div>
          ) : (
            <p className="text-lg text-gray-500 italic mb-4">Precio a consultar</p>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>
          )}

          {Object.keys(product.specs).length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark mb-2">Especificaciones</h3>
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

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 transition-colors"
          >
            <Phone size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
