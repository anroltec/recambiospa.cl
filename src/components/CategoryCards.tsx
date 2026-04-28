import Link from "next/link";
import { ArrowRight, Grid3x3 } from "lucide-react";
import { categories, products } from "@/data/products";
import { countByCategory } from "@/lib/filters";

// Curated order for homepage
const HOMEPAGE_CATS = [
  "iluminacion",
  "baterias",
  "extintores",
  "amarras",
  "herramientas",
  "calefaccion",
  "electrico",
  "seguridad",
  "adhesivos",
];

export default function CategoryCards() {
  const catCounts = countByCategory(products);
  const displayCats = HOMEPAGE_CATS.map((id) => categories.find((c) => c.id === id)).filter(Boolean) as typeof categories;

  return (
    <section className="bg-light py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Grid3x3 size={14} className="text-primary" />
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                Explorar por categoría
              </p>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-dark uppercase tracking-tight leading-tight">
              Todo lo que necesita<br />
              <span className="text-primary">su flota</span>
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-bold text-dark uppercase tracking-wider hover:text-primary transition-colors border-b border-gray-300 hover:border-primary pb-1 self-end md:self-auto whitespace-nowrap"
          >
            Ver catálogo completo <ArrowRight size={13} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {displayCats.map((cat) => {
            const count = catCounts[cat.id] ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/collections/${cat.id}`}
                className="group relative bg-white border border-gray-200 hover:border-transparent hover:shadow-xl transition-all overflow-hidden"
                style={{ "--cat-color": cat.color } as React.CSSProperties}
              >
                {/* Color accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5"
                  style={{ backgroundColor: cat.color }}
                />

                {/* Background fill on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity"
                  style={{ backgroundColor: cat.color }}
                />

                <div className="relative pl-5 pr-4 py-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-dark uppercase tracking-wide group-hover:text-dark transition-colors leading-snug truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] mt-1 font-medium" style={{ color: cat.color }}>
                      {count > 0 ? `${count} productos` : "Ver colección"}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 opacity-20 group-hover:opacity-30 transition-opacity rounded-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* "Ver todas" tile */}
          <Link
            href="/collections"
            className="group relative bg-primary-dark border border-white/10 hover:border-primary/40 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
            <div className="relative pl-5 pr-4 py-5 flex items-center justify-between gap-3 h-full">
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wide leading-snug">
                  Ver todas
                </p>
                <p className="text-[10px] mt-1 text-primary font-medium">
                  {products.length} referencias
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/20 flex items-center justify-center flex-shrink-0">
                <ArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
