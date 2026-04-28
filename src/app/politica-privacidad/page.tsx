import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de Recambio SpA. Conoce cómo protegemos tus datos personales y tus derechos como usuario.",
  alternates: { canonical: "/politica-privacidad" },
};
import { ChevronRight } from "lucide-react";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Pol&iacute;tica de Privacidad</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Pol&iacute;tica de Privacidad</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">1. Informaci&oacute;n que recopilamos</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Recambio SpA recopila informaci&oacute;n personal cuando usted realiza una compra, se registra
              en nuestro sitio, o se comunica con nosotros. Esta informaci&oacute;n puede incluir su nombre,
              direcci&oacute;n de correo electr&oacute;nico, n&uacute;mero de tel&eacute;fono y direcci&oacute;n de env&iacute;o.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">2. Uso de la informaci&oacute;n</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Utilizamos su informaci&oacute;n personal para procesar pedidos, mejorar nuestro servicio,
              enviar comunicaciones relacionadas con sus compras y, si usted lo autoriza, enviar
              informaci&oacute;n sobre productos y promociones.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">3. Protecci&oacute;n de datos</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Implementamos medidas de seguridad para proteger su informaci&oacute;n personal contra
              acceso no autorizado, alteraci&oacute;n, divulgaci&oacute;n o destrucci&oacute;n. Sus datos son
              tratados de forma confidencial y de acuerdo con la legislaci&oacute;n chilena vigente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">4. Cookies</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Nuestro sitio web utiliza cookies para mejorar su experiencia de navegaci&oacute;n.
              Las cookies nos permiten recordar sus preferencias y optimizar el funcionamiento del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">5. Derechos del usuario</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Usted tiene derecho a acceder, rectificar y eliminar sus datos personales en cualquier
              momento. Para ejercer estos derechos, puede contactarnos a trav&eacute;s de
              ventas@recambiospa.cl.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-dark mb-3">6. Contacto</h2>
            <p className="text-sm text-dark/70 leading-relaxed">
              Si tiene preguntas sobre esta pol&iacute;tica de privacidad, puede contactarnos en
              ventas@recambiospa.cl o a trav&eacute;s de nuestro formulario de{" "}
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
