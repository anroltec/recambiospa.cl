import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de Privacidad | Recambio SPA",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-light min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Política de Privacidad</span>
          </nav>
        </Container>
      </div>

      <Container className="py-14 max-w-3xl">
        <h1 className="text-2xl font-bold text-dark uppercase tracking-wide mb-8">
          Política de Privacidad
        </h1>

        <div className="bg-white border border-gray-200 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-dark text-base mb-3">1. Información que recopilamos</h2>
            <p>
              Recambio SPA recopila únicamente la información necesaria para procesar tus consultas y pedidos:
              nombre, correo electrónico, teléfono y dirección de despacho. Esta información es entregada
              voluntariamente por el usuario al contactarnos o completar un formulario.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">2. Uso de la información</h2>
            <p>
              La información recopilada se utiliza exclusivamente para responder consultas, procesar pedidos
              y mejorar nuestros servicios. No compartimos tus datos con terceros sin tu consentimiento expreso.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">3. Cookies</h2>
            <p>
              Este sitio utiliza cookies técnicas necesarias para el funcionamiento del carrito de compras
              y la navegación. No utilizamos cookies de seguimiento o publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">4. Seguridad</h2>
            <p>
              Implementamos medidas técnicas razonables para proteger tu información. Sin embargo, ningún
              método de transmisión por internet es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">5. Contacto</h2>
            <p>
              Para ejercer tus derechos de acceso, rectificación o eliminación de datos, contáctanos
              en <a href="mailto:ventas@recambiospa.cl" className="text-primary hover:underline">ventas@recambiospa.cl</a>.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            Última actualización: abril 2025
          </p>
        </div>
      </Container>
    </div>
  );
}
