import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Recambio SPA",
};

export default function TerminosPage() {
  return (
    <div className="bg-light min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Términos y Condiciones</span>
          </nav>
        </Container>
      </div>

      <Container className="py-14 max-w-3xl">
        <h1 className="text-2xl font-bold text-dark uppercase tracking-wide mb-8">
          Términos y Condiciones
        </h1>

        <div className="bg-white border border-gray-200 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-dark text-base mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar el sitio web de Recambio SPA, aceptas quedar vinculado por estos
              Términos y Condiciones. Si no estás de acuerdo con alguno de los términos, por favor
              no utilices este sitio.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">2. Productos y precios</h2>
            <p>
              Los precios mostrados en el catálogo son en pesos chilenos (CLP) y se expresan en valores
              netos (sin IVA), salvo indicación contraria. Recambio SPA se reserva el derecho de modificar
              precios sin previo aviso. Las cotizaciones formales se emiten por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">3. Disponibilidad de stock</h2>
            <p>
              La disponibilidad de productos mostrada en el sitio es referencial. El stock se confirma
              al momento de procesar cada pedido. En caso de quiebre de stock, te contactaremos para
              ofrecerte alternativas.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">4. Despachos</h2>
            <p>
              Realizamos envíos a todo Chile a través de empresas de transporte. Los plazos y costos
              de despacho dependen de la región de destino y se informan al momento de la cotización.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">5. Devoluciones</h2>
            <p>
              Aceptamos devoluciones dentro de los 10 días hábiles desde la recepción del producto,
              siempre que se encuentre en su embalaje original y sin uso. Contacta a nuestro equipo
              para gestionar una devolución.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-dark text-base mb-3">6. Propiedad intelectual</h2>
            <p>
              Todos los contenidos de este sitio (textos, imágenes, logos y código) son propiedad de
              Recambio SPA o de sus respectivos titulares. Queda prohibida su reproducción sin autorización.
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
