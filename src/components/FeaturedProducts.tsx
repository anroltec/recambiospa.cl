import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

const FEATURED_SKUS = [
  "04-01-06-014-1105",
  "99-01-06-014-77",
  "99-01-06-014-78",
  "04-01-02-014-71",
  "00-05-51-056-482",
  "00-05-51-056-466",
  "00-05-51-056-467",
  "00-05-51-056-471",
];

const featuredProducts = products.filter((p) => FEATURED_SKUS.includes(p.code));

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-primary" />
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                Selección destacada
              </p>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-dark uppercase tracking-tight leading-tight">
              Productos más<br />
              <span className="text-primary">solicitados</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Stats row */}
            <div className="flex items-center gap-6">
              {[
                { n: `${products.length}+`, label: "En catálogo" },
                { n: "7+", label: "Marcas" },
                { n: "100%", label: "Originales" },
              ].map(({ n, label }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-black text-dark">{n}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs font-bold text-dark uppercase tracking-wider hover:text-primary transition-colors border-b border-gray-300 hover:border-primary pb-1 whitespace-nowrap"
            >
              Ver catálogo completo <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            Precios sin IVA — disponibilidad y descuentos por volumen a través de WhatsApp
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
            >
              Catálogo completo <ArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/569xxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-primary text-dark hover:text-primary font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
