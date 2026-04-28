"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { products, categories, formatPrice, type Product } from "@/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.code !== product.code)
      .slice(0, 4);
  }, [product]);

  const categoryInfo = categories.find((c) => c.id === product.category);
  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa el producto: ${product.name} (SKU: ${product.code})`
  );

  return (
    <>
      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200">
          <div className="md:flex">
            {/* Image gallery */}
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-square bg-gray-50 border border-gray-100 mb-3">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {product.inStock && product.price && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 uppercase">
                    En stock
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 border-2 flex-shrink-0 bg-gray-50 transition-colors ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} vista ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="md:w-1/2 p-6 md:pl-2">
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl font-bold text-dark leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-steel mb-5">SKU: {product.code}</p>

              {product.price ? (
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-steel mt-1">+ IVA</p>
                </div>
              ) : (
                <p className="text-xl font-semibold text-dark/50 mb-6">
                  Consultar precio
                </p>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">
                  Descripci&oacute;n
                </h2>
                <p className="text-sm text-dark/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs */}
              {Object.keys(product.specs).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-2">
                    Ficha T&eacute;cnica
                  </h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="py-2 px-3 font-medium text-dark/70 w-2/5">
                            {key}
                          </td>
                          <td className="py-2 px-3 text-dark">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  {product.price ? "Agregar al carro" : "Cotizar"}
                </button>
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.code}
                  href={`/producto/${rp.code}`}
                  className="bg-white border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={rp.images[0]}
                      alt={rp.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                      {rp.brand}
                    </p>
                    <h3 className="text-sm font-medium text-dark leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
                      {rp.name}
                    </h3>
                    {rp.price ? (
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(rp.price)}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-dark/50">
                        Consultar precio
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
