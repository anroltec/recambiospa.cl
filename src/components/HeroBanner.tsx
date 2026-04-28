import Link from "next/link";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { categories, products } from "@/data/products";
import { countByCategory } from "@/lib/filters";

// Categorías destacadas en el mosaico del hero
const HERO_CAT_IDS = [
  "iluminacion",
  "baterias",
  "herramientas",
  "extintores",
  "amarras",
  "adhesivos",
  "calefaccion",
  "electrico",
  "seguridad",
];

export default function HeroBanner() {
  const catCounts = countByCategory(products);
  const heroCategories = categories.filter((c) => HERO_CAT_IDS.includes(c.id));

  return (
    <section className="relative bg-primary-dark overflow-hidden min-h-[88vh] flex items-center">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Diagonal decorative lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <line x1="-50" y1="850" x2="850" y2="-50" stroke="#334FB4" strokeWidth="1" strokeOpacity="0.25" />
        <line x1="250" y1="850" x2="1150" y2="-50" stroke="#334FB4" strokeWidth="1" strokeOpacity="0.12" />
        <line x1="-350" y1="850" x2="550" y2="-50" stroke="#334FB4" strokeWidth="1" strokeOpacity="0.08" />
        <circle cx="1200" cy="600" r="300" stroke="#334FB4" strokeWidth="1" strokeOpacity="0.06" fill="none" />
        <circle cx="1200" cy="600" r="200" stroke="#334FB4" strokeWidth="1" strokeOpacity="0.06" fill="none" />
      </svg>

      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

      <div className="relative max-w-7xl mx-auto px-4 w-full py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT COPY ──────────────────────────────── */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 px-3 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.25em]">
                Stock disponible — despacho inmediato
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black uppercase leading-[0.88] tracking-tight mb-7">
              <span className="block text-[clamp(2.5rem,5vw,4rem)] text-white">
                IMPORTACIÓN
              </span>
              <span
                className="block text-[clamp(2.5rem,5vw,4rem)] text-transparent"
                style={{ WebkitTextStroke: "2px #334FB4" }}
              >
                &amp; DISTRIBUCIÓN
              </span>
              <span className="block text-[clamp(1.5rem,3vw,2.25rem)] text-white/20 mt-2">
                DE REPUESTOS PARA CHILE
              </span>
            </h1>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-primary" />
              <p className="text-white/50 text-sm leading-relaxed max-w-md">
                Repuestos y accesorios de marcas líderes para vehículos livianos y pesados.
                Atendemos talleres, flotas y empresas con despacho a todo Chile.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-7 py-4 text-sm uppercase tracking-wider transition-colors"
              >
                Ver catálogo completo <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/569xxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-primary hover:text-white text-white/60 font-bold px-7 py-4 text-sm uppercase tracking-wider transition-colors"
              >
                Cotizar por WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              {[
                { value: `${products.length}+`, label: "Productos" },
                { value: "7+", label: "Marcas int." },
                { value: "100%", label: "Chile" },
                { value: "B2B", label: "Especializado" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-[9px] text-white/35 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: CATEGORY MOSAIC ─────────────────── */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] text-white/25 uppercase tracking-[0.25em] font-bold">
                Categorías disponibles
              </p>
              <Link
                href="/collections"
                className="text-[9px] text-white/25 hover:text-primary uppercase tracking-wider font-bold flex items-center gap-1 transition-colors"
              >
                Ver todas <ArrowRight size={10} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {heroCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.id}`}
                  className="group relative bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/20 p-4 transition-all"
                >
                  {/* Color accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: cat.color }}
                  />
                  <p className="text-xs font-bold text-white/60 group-hover:text-white transition-colors leading-snug pr-4">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-white/25 mt-1.5">
                    {catCounts[cat.id] ?? 0} productos
                  </p>
                  <ChevronRight
                    size={12}
                    className="absolute top-3 right-2.5 text-white/15 group-hover:text-white/40 transition-colors"
                  />
                </Link>
              ))}
            </div>

            {/* Bottom accent */}
            <div className="mt-5 flex items-center gap-3">
              <Zap size={12} className="text-primary" />
              <p className="text-[10px] text-white/25">
                Disponibilidad y precios por WhatsApp o correo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </section>
  );
}
