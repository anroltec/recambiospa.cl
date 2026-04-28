import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight, Truck, Shield, Award, Users, CheckCircle2,
  Package, Globe, Building2, Wrench, Zap, ArrowRight,
} from "lucide-react";
import { brandLogos } from "@/data/brands";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Nosotros | Recambio SPA",
  description: "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados. Envíos a todo Chile.",
};

const stats = [
  { value: "150+", label: "Productos en catálogo" },
  { value: "7+", label: "Marcas internacionales" },
  { value: "100%", label: "Cobertura nacional" },
  { value: "B2B", label: "Atención especializada" },
];

const valores = [
  {
    icon: Shield,
    title: "Calidad sin compromiso",
    desc: "Trabajamos exclusivamente con marcas certificadas y homologadas. Cada producto pasa por controles de calidad antes de llegar a nuestros clientes.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Truck,
    title: "Distribución nacional",
    desc: "Despachamos a todo Chile mediante empresas de transporte de confianza. Coordinamos el envío para que llegue en tiempo y forma a tu puerta.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Award,
    title: "Respaldo técnico",
    desc: "Nuestro equipo conoce cada producto que comercializamos. Te asesoramos en la selección correcta para tu vehículo o flota.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Users,
    title: "Relaciones de largo plazo",
    desc: "No buscamos ventas únicas. Construimos relaciones comerciales duraderas con talleres, flotas y empresas de transporte.",
    color: "bg-orange-50 text-orange-600",
  },
];

const clientes = [
  { icon: Building2, label: "Talleres mecánicos" },
  { icon: Truck, label: "Flotas de transporte" },
  { icon: Package, label: "Empresas de logística" },
  { icon: Globe, label: "Empresas mineras" },
  { icon: Wrench, label: "Maestranzas" },
  { icon: Zap, label: "Servicios eléctricos automotrices" },
];

const ventajas = [
  "Stock disponible para despacho inmediato",
  "Cotización sin costo ni compromiso",
  "Facturas y boletas a nombre de empresa o persona",
  "Asesoría técnica por WhatsApp",
  "Precios competitivos para compras en volumen",
  "Productos originales y certificados",
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Nosotros</span>
          </nav>
        </Container>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative bg-primary-dark overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

        <Container className="relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Comercializadora Recambio SPA
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-6">
              Soluciones para<br />
              <span className="text-primary">el transporte</span><br />
              de Chile
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xl">
              Importamos y distribuimos repuestos, accesorios y equipamiento de alta calidad
              para vehículos livianos y pesados. Atendemos talleres, flotas y empresas
              en todo el territorio nacional.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 text-sm uppercase tracking-wider transition-colors"
              >
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-bold px-6 py-3 text-sm uppercase tracking-wider transition-colors"
              >
                Solicitar cotización
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <section className="bg-primary">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
            {stats.map(({ value, label }) => (
              <div key={label} className="py-8 px-6 text-center">
                <p className="text-3xl lg:text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── QUIÉNES SOMOS ───────────────────────────────── */}
      <section className="bg-white py-20">
        <Container>
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Nuestra historia
              </p>
              <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-6">
                ¿Quiénes somos?
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Recambio SPA es una empresa comercializadora con sede en Chile, nacida de la necesidad
                  de ofrecer al mercado del transporte productos de calidad mundial a precios accesibles
                  y con disponibilidad inmediata.
                </p>
                <p>
                  Nos especializamos en la importación directa de repuestos y accesorios para vehículos
                  livianos y pesados, trabajando con marcas líderes como Braslux, Loctite, Teroson,
                  Wurth, Moura y Danval, entre otras.
                </p>
                <p>
                  Atendemos a talleres mecánicos, flotas de transporte, empresas mineras, maestranzas
                  y clientes particulares en todo el territorio nacional, ofreciendo asesoría
                  personalizada y despacho a cualquier región de Chile.
                </p>
              </div>
            </div>

            {/* Visual block */}
            <div className="mt-10 lg:mt-0 relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-dark p-8 flex flex-col justify-between aspect-square">
                  <Truck size={32} className="text-primary" />
                  <div>
                    <p className="text-3xl font-black text-white">Chile</p>
                    <p className="text-white/50 text-xs uppercase tracking-wider mt-1">Cobertura total</p>
                  </div>
                </div>
                <div className="bg-light border border-gray-200 p-8 flex flex-col justify-between aspect-square">
                  <Package size={32} className="text-primary" />
                  <div>
                    <p className="text-3xl font-black text-dark">150+</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Productos</p>
                  </div>
                </div>
                <div className="bg-light border border-gray-200 p-8 flex flex-col justify-between aspect-square">
                  <Award size={32} className="text-primary" />
                  <div>
                    <p className="text-3xl font-black text-dark">7+</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Marcas top</p>
                  </div>
                </div>
                <div className="bg-primary p-8 flex flex-col justify-between aspect-square">
                  <Shield size={32} className="text-white/60" />
                  <div>
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Originales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MISIÓN ──────────────────────────────────────── */}
      <section className="bg-primary-dark py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <Container className="relative text-center max-w-3xl">
          <div className="w-1 h-12 bg-primary mx-auto mb-8" />
          <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Nuestra misión
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Facilitar el acceso de empresas y talleres chilenos a productos de calidad mundial
            para el mantenimiento y operación de flotas de transporte, reduciendo tiempos de
            inactividad y optimizando los costos operativos de nuestros clientes.
          </p>
        </Container>
      </section>

      {/* ── VALORES ─────────────────────────────────────── */}
      <section className="bg-light py-20">
        <Container>
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Lo que nos define
            </p>
            <h2 className="text-3xl font-black text-dark uppercase tracking-tight">
              Nuestros valores
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valores.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all group p-7"
              >
                <div className={`w-12 h-12 flex items-center justify-center mb-5 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-dark text-sm uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── VENTAJAS ────────────────────────────────────── */}
      <section className="bg-white py-20">
        <Container>
          <div className="lg:grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                ¿Por qué elegirnos?
              </p>
              <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-8">
                Trabajar con nosotros es fácil
              </h2>
              <ul className="space-y-3">
                {ventajas.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Clientes que atendemos
              </p>
              <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-8">
                ¿Es para ti?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {clientes.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 border border-gray-200 px-4 py-4 bg-light"
                  >
                    <div className="w-8 h-8 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-dark">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MARCAS ──────────────────────────────────────── */}
      <section className="bg-light py-16 border-y border-gray-200 overflow-hidden">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">
          Marcas que distribuimos
        </p>

        {/* Marquee track */}
        <div className="relative w-full overflow-hidden">
          {/* Fades laterales */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-light to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-light to-transparent pointer-events-none" />

          <div className="flex" style={{ animation: "marquee-nosotros 28s linear infinite" }}>
            {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((brand, i) => (
              <Link
                key={`${brand.name}-${i}`}
                href={brand.href}
                className="group flex-shrink-0 flex items-center justify-center px-10 py-2"
                style={{ minWidth: "180px" }}
                title={brand.name}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={60}
                  className="object-contain h-10 w-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-nosotros {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="bg-primary-dark py-20">
        <Container className="text-center max-w-2xl">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            ¿Listo para cotizar?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Contáctanos hoy y recibe una cotización personalizada sin costo.
            Atendemos por WhatsApp, correo electrónico y teléfono.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-colors"
            >
              Contáctanos ahora <ArrowRight size={16} />
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
