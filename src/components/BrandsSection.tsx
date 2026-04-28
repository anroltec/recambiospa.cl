import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { brandLogos } from "@/data/brands";

export default function BrandsSection() {
  return (
    <section className="bg-primary-dark py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck size={14} className="text-primary" />
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                Distribuidores autorizados
              </p>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-tight">
              Marcas líderes<br />
              <span className="text-primary">del mercado</span>
            </h2>
          </div>
          <Link
            href="/marcas"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1 self-end md:self-auto whitespace-nowrap"
          >
            Ver todas las marcas <ArrowRight size={13} />
          </Link>
        </div>

        {/* Brand logos */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-white/[0.07]">
          {brandLogos.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group relative bg-primary-dark hover:bg-white/[0.07] transition-colors aspect-[5/3] flex items-center justify-center p-5"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={150}
                height={70}
                className="object-contain max-h-12 w-auto filter grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300"
              />
            </Link>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            "Importación directa desde fabricantes",
            "Garantía de fábrica en todos los productos",
            "Documentación y certificaciones disponibles",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-3">
              <BadgeCheck size={13} className="text-primary flex-shrink-0" />
              <span className="text-[11px] text-white/60">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
