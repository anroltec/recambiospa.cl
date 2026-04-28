import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Truck, Shield, Award, Users } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Nosotros | Recambio SPA",
  description: "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados. Envíos a todo Chile.",
};

const valores = [
  { icon: Truck, title: "Distribución nacional", desc: "Envíos a todo Chile con despacho rápido y seguro." },
  { icon: Shield, title: "Calidad garantizada", desc: "Trabajamos solo con marcas reconocidas y productos certificados." },
  { icon: Award, title: "Experiencia", desc: "Años de trayectoria en el rubro automotriz y de transporte." },
  { icon: Users, title: "Atención personalizada", desc: "Equipo especializado para asesorarte en cada compra." },
];

export default function NosotrosPage() {
  return (
    <div className="bg-light min-h-screen">
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

      {/* Hero */}
      <div className="bg-primary-dark text-white py-14">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">Sobre Recambio SPA</h1>
          <p className="text-white/70 max-w-2xl text-sm leading-relaxed">
            Somos una empresa chilena especializada en la importación y distribución de repuestos,
            accesorios y soluciones para el transporte de carga y pasajeros.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        {/* Quiénes somos */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-4">¿Quiénes somos?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Recambio SPA es una empresa comercializadora con sede en Chile, dedicada a la importación
            y distribución de repuestos y accesorios de alta calidad para vehículos livianos y pesados.
            Trabajamos con marcas líderes a nivel mundial para entregar soluciones confiables a talleres,
            flotas y clientes particulares en todo el territorio nacional.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Nuestro catálogo abarca desde iluminación LED y baterías hasta herramientas especializadas,
            extintores, amarras y sistemas de calefacción, cubriendo las necesidades de buses, camiones,
            vehículos de pasajeros y maquinaria en general.
          </p>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {valores.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 p-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">¿Necesitas un presupuesto?</h3>
            <p className="text-white/80 text-sm">Contáctanos y te asesoramos sin compromiso.</p>
          </div>
          <Link
            href="/contacto"
            className="bg-white text-primary font-bold px-8 py-3 hover:bg-light transition-colors text-sm uppercase tracking-wider whitespace-nowrap"
          >
            Contáctanos
          </Link>
        </div>
      </Container>
    </div>
  );
}
