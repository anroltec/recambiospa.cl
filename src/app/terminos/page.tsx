import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de compra en Recambio SpA. Información sobre envíos, garantías, devoluciones y formas de pago.",
  alternates: { canonical: "/terminos" },
};
import { ChevronRight } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">T&eacute;rminos y Condiciones</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">T&eacute;rminos y Condiciones</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">1. Generalidades</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Los presentes t&eacute;rminos y condiciones regulan el uso del sitio web recambiospa.cl
              y las compras realizadas a trav&eacute;s del mismo. Al utilizar este sitio, usted acepta
              estos t&eacute;rminos en su totalidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">2. Productos y precios</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Los precios publicados en el sitio est&aacute;n expresados en pesos chilenos (CLP) y no
              incluyen IVA, salvo que se indique lo contrario. Recambio SpA se reserva el derecho
              de modificar precios sin previo aviso. Las im&aacute;genes de los productos son referenciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">3. Despacho y env&iacute;os</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Realizamos env&iacute;os a todo Chile. Los plazos de entrega var&iacute;an seg&uacute;n la ubicaci&oacute;n
              de destino y la disponibilidad del producto. Los costos de env&iacute;o ser&aacute;n informados
              antes de confirmar la compra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">4. Garant&iacute;a y devoluciones</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Todos nuestros productos cuentan con garant&iacute;a legal seg&uacute;n la legislaci&oacute;n chilena.
              Si recibe un producto defectuoso o diferente al solicitado, puede solicitar cambio
              o devoluci&oacute;n dentro de los primeros 10 d&iacute;as h&aacute;biles desde la recepci&oacute;n.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">5. Formas de pago</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Aceptamos transferencia bancaria y otros medios de pago que ser&aacute;n informados
              al momento de la compra. El pedido ser&aacute; procesado una vez confirmado el pago.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">6. Contacto</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Para consultas sobre estos t&eacute;rminos, escr&iacute;banos a ventas@recambiospa.cl
              o visite nuestra p&aacute;gina de{" "}
              <Link href="/contacto" className="text-primary hover:underline">
                contacto
              </Link>
              .
            </p>
          </section>

          <p className="text-xs text-dark/40 pt-4 border-t border-gray-100">
            &Uacute;ltima actualizaci&oacute;n: Abril 2026
          </p>
        </div>
      </div>
    </div>
  );
}
