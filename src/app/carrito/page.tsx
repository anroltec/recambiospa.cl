import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carrito de Compras",
  robots: { index: false, follow: false },
};
import { ChevronRight, ShoppingCart } from "lucide-react";

export default function CarritoPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Carrito</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Carrito de Compras</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={36} className="text-steel/50" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Tu carrito est&aacute; vac&iacute;o</h2>
          <p className="text-dark/60 text-sm mb-6">
            Explora nuestro cat&aacute;logo y agrega los productos que necesitas.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 text-sm uppercase tracking-wide transition-colors"
          >
            Ver cat&aacute;logo
          </Link>
        </div>
      </div>
    </div>
  );
}
