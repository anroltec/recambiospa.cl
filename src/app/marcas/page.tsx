import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, Package, Tag, BadgeCheck } from "lucide-react";
import { brandLogos } from "@/data/brands";
import { products, brands as productBrands } from "@/data/products";
import { countByBrand } from "@/lib/filters";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Marcas | Recambio SPA",
  description: "Distribuimos las principales marcas de repuestos y accesorios para el transporte. Braslux, Loctite, Moura, Wurth y más.",
};

const brandInfo: Record<string, { desc: string; specialties: string[]; origin: string }> = {
  Braslux: {
    desc: "Líder latinoamericano en iluminación LED y convencional para vehículos de transporte público y carga. Amplia gama de focos, faros y lanternas de alta durabilidad.",
    specialties: ["Iluminación LED", "Faros", "Lanternas"],
    origin: "Brasil",
  },
  Henkel: {
    desc: "Grupo alemán con más de 145 años de historia. Propietario de marcas líderes en adhesivos, selladores y tratamientos de superficies para la industria automotriz global.",
    specialties: ["Adhesivos", "Selladores", "Químicos"],
    origin: "Alemania",
  },
  Loctite: {
    desc: "La marca de referencia mundial en adhesivos técnicos, trabadores de rosca, selladores de juntas y compuestos de fijación para aplicaciones industriales y automotrices.",
    specialties: ["Trabadores de rosca", "Selladores", "Adhesivos estructurales"],
    origin: "EE.UU. / Henkel",
  },
  Mobileye: {
    desc: "Tecnología avanzada de asistencia al conductor (ADAS) para la prevención de colisiones en flotas de buses y camiones. Soluciones de seguridad activa certificadas.",
    specialties: ["Seguridad activa", "Detección de colisiones", "ADAS"],
    origin: "Israel",
  },
  Moura: {
    desc: "Fabricante sudamericano con más de 60 años produciendo baterías de alto rendimiento para vehículos livianos, pesados y maquinaria industrial.",
    specialties: ["Baterías livianos", "Baterías pesados", "Alto rendimiento"],
    origin: "Brasil",
  },
  TEROSON: {
    desc: "Marca de Henkel especializada en adhesivos de carrocería, selladores de juntas, productos de amortiguación de vibraciones y tratamientos anti-corrosión.",
    specialties: ["Selladores de carrocería", "Anti-vibración", "Anti-corrosión"],
    origin: "Alemania / Henkel",
  },
  Wurth: {
    desc: "La empresa más grande del mundo en distribución de fijaciones, herramientas, consumibles y productos químicos para talleres automotrices y maestranzas.",
    specialties: ["Herramientas", "Fijaciones y tornillería", "Productos químicos"],
    origin: "Alemania",
  },
};

export default function MarcasPage() {
  const brandCounts = countByBrand(products);

  // Total de marcas con productos en catálogo
  const brandsWithProducts = productBrands.filter((b) => (brandCounts[b] ?? 0) > 0).length;

  const stats = [
    { value: `${brandLogos.length}`, label: "Marcas internacionales" },
    { value: `${brandsWithProducts}`, label: "Con stock disponible" },
    { value: `${products.length}+`, label: "Productos en catálogo" },
    { value: "100%", label: "Originales certificados" },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Marcas</span>
          </nav>
        </Container>
      </div>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
        <Container className="relative py-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Distribuidores autorizados
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-5">
              Marcas líderes<br />
              <span className="text-primary">del mundo</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
              Trabajamos directamente con las marcas más reconocidas del mercado automotriz
              y de transporte, garantizando calidad, disponibilidad y respaldo técnico en cada producto.
            </p>
          </div>
        </Container>
      </section>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <section className="bg-primary">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
            {stats.map(({ value, label }) => (
              <div key={label} className="py-7 px-6 text-center">
                <p className="text-2xl lg:text-3xl font-black text-white mb-0.5">{value}</p>
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── BRAND CARDS ───────────────────────────────── */}
      <section className="bg-light py-16">
        <Container>
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Nuestro portfolio
            </p>
            <h2 className="text-2xl font-black text-dark uppercase tracking-tight">
              Marcas que distribuimos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brandLogos.map((brand) => {
              const info = brandInfo[brand.name];
              // Case-insensitive match against products brands
              const matchKey = productBrands.find(
                (b) => b.toLowerCase() === brand.name.toLowerCase()
              );
              const productCount = matchKey ? (brandCounts[matchKey] ?? 0) : 0;

              return (
                <Link
                  key={brand.name}
                  href={brand.href}
                  className="group bg-white border border-gray-200 hover:border-primary hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  {/* Logo area */}
                  <div className="relative bg-white px-10 py-10 flex items-center justify-center border-b border-gray-100 min-h-[120px]">
                    <div className="relative w-full h-16">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="240px"
                      />
                    </div>
                    {/* Product count badge */}
                    {productCount > 0 && (
                      <span className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black px-2 py-1 uppercase tracking-wider">
                        {productCount} productos
                      </span>
                    )}
                    {productCount === 0 && (
                      <span className="absolute top-3 right-3 bg-gray-200 text-gray-500 text-[9px] font-black px-2 py-1 uppercase tracking-wider">
                        Próximamente
                      </span>
                    )}
                  </div>

                  {/* Info area */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-black text-dark text-base uppercase tracking-wide group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      {info?.origin && (
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 ml-2 flex-shrink-0">
                          {info.origin}
                        </span>
                      )}
                    </div>

                    {info?.desc && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
                        {info.desc}
                      </p>
                    )}

                    {/* Specialties */}
                    {info?.specialties && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {info.specialties.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-wide bg-primary/8 px-2 py-1"
                          >
                            <Tag size={8} />
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Package size={12} />
                        <span>
                          {productCount > 0
                            ? `${productCount} referencia${productCount !== 1 ? "s" : ""} en stock`
                            : "Disponible próximamente"}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                        Ver productos
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────── */}
      <section className="bg-primary-dark py-16">
        <Container>
          <div className="lg:flex items-center justify-between gap-12">
            <div className="mb-8 lg:mb-0 max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck size={20} className="text-primary" />
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
                  Garantía de autenticidad
                </p>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Solo productos 100% originales
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Todos los productos que comercializamos son importados directamente desde los fabricantes
                o distribuidores autorizados. No trabajamos con réplicas ni productos de procedencia
                dudosa. Cada ítem incluye garantía de fábrica y documentación de origen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:w-72 flex-shrink-0">
              {[
                "Importación directa desde fabricantes",
                "Garantía de fábrica en todos los productos",
                "Documentación y certificaciones disponibles",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3">
                  <BadgeCheck size={14} className="text-primary flex-shrink-0" />
                  <span className="text-xs text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-gray-200">
        <Container className="text-center max-w-xl">
          <h2 className="text-2xl font-black text-dark uppercase tracking-tight mb-3">
            ¿No encuentras tu marca?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Constantemente ampliamos nuestro portfolio. Si trabajas con una marca específica
            y no la ves aquí, contáctanos — puede que ya tengamos disponibilidad o podamos conseguirla.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              Consultar disponibilidad <ArrowRight size={15} />
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-primary text-dark hover:text-primary font-bold px-7 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              Ver catálogo completo
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
