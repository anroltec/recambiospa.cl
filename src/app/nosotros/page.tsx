import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros - Importación y Distribución de Soluciones para Transporte",
  description:
    "Conoce Recambio SpA: importación y distribución de repuestos y accesorios para vehículos livianos y pesados en Chile. Calidad garantizada, envíos a todo el país.",
  alternates: { canonical: "/nosotros" },
};
import { ChevronRight, Truck, Shield, Clock, Users } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Nosotros</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Nosotros</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Intro */}
        <div className="bg-white border border-gray-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-4">
            Importaci&oacute;n y Distribuci&oacute;n de Soluciones para Transporte
          </h2>
          <p className="text-dark/70 leading-relaxed mb-4">
            En <strong>Recambio SpA</strong>{" "}nos especializamos en la importaci&oacute;n y distribuci&oacute;n de
            repuestos, accesorios e insumos para veh&iacute;culos livianos y pesados. Trabajamos con las mejores
            marcas del mercado para ofrecer productos de alta calidad a precios competitivos.
          </p>
          <p className="text-dark/70 leading-relaxed mb-4">
            Nuestro equipo cuenta con amplia experiencia en el rubro automotriz, lo que nos permite
            asesorar a nuestros clientes de manera personalizada y encontrar la soluci&oacute;n adecuada
            para cada necesidad.
          </p>
          <p className="text-dark/70 leading-relaxed">
            Realizamos env&iacute;os a todo Chile, asegurando que nuestros productos lleguen en
            &oacute;ptimas condiciones y en el menor tiempo posible.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Truck,
              title: "Env\u00edos a todo Chile",
              desc: "Cobertura nacional con despachos r\u00e1pidos y seguros para que recibas tus productos donde los necesites.",
            },
            {
              icon: Shield,
              title: "Calidad Garantizada",
              desc: "Trabajamos solo con marcas reconocidas y productos certificados que cumplen los m\u00e1s altos est\u00e1ndares.",
            },
            {
              icon: Clock,
              title: "Atenci\u00f3n R\u00e1pida",
              desc: "Nuestro equipo responde tus consultas de forma \u00e1gil para que tengas lo que necesitas sin demoras.",
            },
            {
              icon: Users,
              title: "Asesor\u00eda Especializada",
              desc: "Te ayudamos a encontrar el producto exacto para tu veh\u00edculo con orientaci\u00f3n t\u00e9cnica profesional.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark mb-2">{item.title}</h3>
              <p className="text-sm text-dark/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
