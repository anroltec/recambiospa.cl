import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { brandLogos } from "@/data/brands";

// Duplicamos 4 veces para que el loop infinito sea perfectamente seamless
const track = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

export default function BrandsSection() {
  return (
    <section className="bg-primary-dark py-16 lg:py-20 relative overflow-hidden">
      {/* Dot pattern */}
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
      </div>

      {/* Marquee — full width, sin contenedor */}
      <div className="relative w-full overflow-hidden">
        {/* Fade izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-primary-dark to-transparent pointer-events-none" />
        {/* Fade derecha */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-primary-dark to-transparent pointer-events-none" />

        <div className="flex" style={{ animation: "marquee 28s linear infinite" }}>
          {track.map((brand, i) => (
            <Link
              key={`${brand.name}-${i}`}
              href={brand.href}
              className="group flex-shrink-0 flex items-center justify-center px-10 py-6 border-r border-white/[0.07] hover:bg-white/[0.05] transition-colors"
              style={{ minWidth: "180px" }}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={60}
                className="object-contain h-10 w-auto filter grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Keyframe inyectado inline */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
