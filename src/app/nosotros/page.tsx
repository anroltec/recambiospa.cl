import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Truck, Trophy, Zap, HardHat } from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros - Importación y Distribución de Soluciones para Transporte",
  description:
    "Conoce Recambio SpA: importación y distribución de repuestos y accesorios para vehículos livianos y pesados en Chile. Calidad garantizada, envíos a todo el país.",
  alternates: { canonical: "/nosotros" },
};

const values = [
  {
    icon: Truck,
    title: "Envíos a todo Chile",
    desc: "Cobertura nacional con despachos directos a todas las regiones, sin intermediarios.",
  },
  {
    icon: Trophy,
    title: "Calidad garantizada",
    desc: "Solo trabajamos con marcas reconocidas y productos con respaldo de fábrica.",
  },
  {
    icon: Zap,
    title: "Respuesta rápida",
    desc: "Cotizaciones y consultas respondidas el mismo día hábil.",
  },
  {
    icon: HardHat,
    title: "Asesoría técnica",
    desc: "Te ayudamos a identificar el repuesto correcto para cada vehículo.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-light">

      {/* Breadcrumb — barra blanca */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Nosotros</span>
          </nav>
        </div>
      </div>

      {/* Hero — oscuro sin grid */}
      <div className="bg-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight">
            Importación y distribución<br className="hidden sm:block" /> para el transporte
          </h1>
        </div>
      </div>

      {/* ── STORY + STATS ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Story — 2/3 */}
          <div className="lg:col-span-2 space-y-4 text-dark/70 leading-relaxed">
            <p>
              En <strong className="text-dark">Recambio SpA</strong> nos especializamos en la
              importación y distribución de repuestos, accesorios e insumos para vehículos
              livianos y pesados. Trabajamos con marcas líderes del mercado para ofrecer
              productos de calidad a precios competitivos.
            </p>
            <p>
              Nuestro equipo tiene amplia experiencia en el rubro automotriz, lo que nos
              permite asesorar a cada cliente de forma directa y encontrar la solución correcta
              para cada necesidad.
            </p>
            <p>
              Despachamos a todo Chile asegurando que los productos lleguen en óptimas
              condiciones y en el menor tiempo posible.
            </p>
          </div>

          {/* Stats — 1/3 */}
          <div className="border-l-2 border-primary pl-8 flex flex-col justify-center gap-7">
            <div>
              <p className="text-4xl font-black text-primary leading-none">+150</p>
              <p className="text-[10px] text-dark/40 uppercase tracking-widest mt-1">
                Referencias en catálogo
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-primary leading-none">16</p>
              <p className="text-[10px] text-dark/40 uppercase tracking-widest mt-1">
                Regiones con despacho
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-primary leading-none">7</p>
              <p className="text-[10px] text-dark/40 uppercase tracking-widest mt-1">
                Marcas distribuidas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── VALUES — filas tipo ficha técnica ────────── */}
      <div className="border-t border-gray-200 bg-white">
        {values.map((item, i) => (
          <div
            key={item.title}
            className={`border-b border-gray-100 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
          >
            <div className="max-w-7xl mx-auto px-4 py-5 grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 items-start">
              <div className="flex items-center gap-3 sm:w-56">
                <div className="w-9 h-9 bg-primary flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="font-bold text-dark text-sm">{item.title}</p>
              </div>
              <p className="text-sm text-dark/55 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
