"use client";

import Link from "next/link";
import Image from "next/image";

const brands = [
  { name: "Braslux", href: "/collections/braslux", logo: "/brands/braslux.png" },
  { name: "Henkel", href: "/collections/henkel", logo: "/brands/henkel.png" },
  { name: "Loctite", href: "/collections/loctite", logo: "/brands/loctite.png" },
  { name: "Mobileye", href: "/collections/mobileye", logo: "/brands/mobileye.jpg" },
  { name: "Moura", href: "/collections/moura", logo: "/brands/moura.png" },
  { name: "TEROSON", href: "/collections/teroson", logo: "/brands/teroson.jpg" },
  { name: "Wurth", href: "/collections/wurth", logo: "/brands/wurth.svg" },
];

export default function BrandsSection() {
  return (
    <section className="py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide">
            Nuestras Marcas
          </h2>
          <Link
            href="/marcas"
            className="text-primary hover:text-primary-light text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Ver todas &rarr;
          </Link>
        </div>
      </div>

      {/* Infinite sliding carousel */}
      <div className="relative group">
        <style>{`
          @keyframes slide-brands {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className="flex"
          style={{
            animation: "slide-brands 25s linear infinite",
            width: "fit-content",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
        >
          {/* Render brands twice for seamless loop */}
          {[...brands, ...brands].map((brand, i) => (
            <Link
              key={`${brand.name}-${i}`}
              href={brand.href}
              className="flex-shrink-0 w-[200px] px-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={160}
                height={80}
                className="object-contain max-h-14 w-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
