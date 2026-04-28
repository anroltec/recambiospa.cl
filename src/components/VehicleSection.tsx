import Link from "next/link";
import { ArrowRight, Car, Truck } from "lucide-react";

const livianos = [
  { name: "Iluminación LED", href: "/collections/iluminacion" },
  { name: "Eléctrico y Sensores", href: "/collections/electrico" },
  { name: "Seguridad vial", href: "/collections/seguridad" },
  { name: "Herramientas", href: "/collections/herramientas" },
  { name: "Adhesivos y Selladores", href: "/collections/adhesivos" },
];

const pesados = [
  { name: "Amarras de carga", href: "/collections/amarras" },
  { name: "Extintores", href: "/collections/extintores" },
  { name: "Baterías de alto rendimiento", href: "/collections/baterias" },
  { name: "Sistemas de calefacción", href: "/collections/calefaccion" },
  { name: "Kit especiales", href: "/collections/kit-especiales" },
];

export default function VehicleSection() {
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2">

          {/* ── LIVIANOS ────────────────────────────────── */}
          <div className="bg-white border-r border-gray-200 p-10 lg:p-14">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
              <Car size={22} className="text-primary" />
            </div>
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Automóviles, camionetas y SUV
            </p>
            <h2 className="text-2xl font-black text-dark uppercase tracking-tight mb-3">
              Vehículos Livianos
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Repuestos y accesorios certificados para el mantenimiento de flotas livianas
              y vehículos particulares.
            </p>
            <ul className="space-y-2.5 mb-10">
              {livianos.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <ArrowRight
                      size={13}
                      className="text-gray-300 group-hover:text-primary flex-shrink-0 transition-colors"
                    />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/vehiculos-livianos"
              className="inline-flex items-center gap-2 border-2 border-dark hover:bg-dark hover:text-white text-dark font-bold px-6 py-3 text-xs uppercase tracking-wider transition-all"
            >
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>

          {/* ── PESADOS ─────────────────────────────────── */}
          <div className="bg-primary-dark p-10 lg:p-14 relative overflow-hidden">
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />

            <div className="relative">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-6">
                <Truck size={22} className="text-primary" />
              </div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                Buses, camiones y maquinaria
              </p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Vehículos Pesados
              </h2>
              <p className="text-white/40 text-sm mb-8">
                Soluciones para flotas de transporte de carga y pasajeros, con foco en
                durabilidad y cumplimiento normativo.
              </p>
              <ul className="space-y-2.5 mb-10">
                {pesados.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ArrowRight
                        size={13}
                        className="text-primary/50 group-hover:text-primary flex-shrink-0 transition-colors"
                      />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/vehiculos-pesados"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
              >
                Ver todo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
