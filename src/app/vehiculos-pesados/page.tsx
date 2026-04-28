import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Vehículos Pesados | Recambio SPA",
  description: "Repuestos y accesorios para buses, camiones y maquinaria. Envíos a todo Chile.",
};

const categories = [
  { name: "Iluminación", desc: "Sistemas de iluminación LED para buses y camiones.", href: "/collections/iluminacion" },
  { name: "Amarras y Sujeción", desc: "Amarras de carga, tensores y sistemas de sujeción.", href: "/collections/amarras" },
  { name: "Extintores", desc: "Extintores y equipamiento contra incendios.", href: "/collections/extintores" },
  { name: "Calefacción", desc: "Sistemas de calefacción para cabinas y carrocerías.", href: "/collections/calefaccion" },
  { name: "Baterías", desc: "Baterías de alto rendimiento para vehículos pesados.", href: "/collections/baterias" },
  { name: "Herramientas", desc: "Herramientas y equipos para taller de camiones.", href: "/collections/herramientas" },
];

export default function VehiculosPesadosPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Vehículos Pesados</span>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <div className="bg-primary-dark text-white py-14">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">Vehículos Pesados</h1>
          <p className="text-white/70 text-sm max-w-xl">
            Soluciones para buses, camiones, maquinaria y flotas de transporte de carga. Calidad y disponibilidad nacional.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-dark uppercase tracking-wide text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/collections"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 text-sm uppercase tracking-wider transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </Container>
    </div>
  );
}
