import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto - Cotizaciones y Consultas",
  description:
    "Contáctanos para cotizaciones de repuestos y accesorios para transporte. Atención por WhatsApp, email y formulario. Santiago, Chile.",
  alternates: { canonical: "/contacto" },
};
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "\u00bfHacen env\u00edos a todo Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "S\u00ed, realizamos env\u00edos a todas las regiones de Chile. Los costos y plazos de env\u00edo var\u00edan seg\u00fan la ubicaci\u00f3n de destino.",
      },
    },
    {
      "@type": "Question",
      name: "\u00bfC\u00f3mo puedo cotizar un producto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes cotizar a trav\u00e9s de nuestro formulario de contacto, por WhatsApp o enviando un email a ventas@recambiospa.cl con el nombre o c\u00f3digo del producto.",
      },
    },
    {
      "@type": "Question",
      name: "\u00bfQu\u00e9 formas de pago aceptan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceptamos transferencia bancaria. El pedido ser\u00e1 procesado una vez confirmado el pago.",
      },
    },
    {
      "@type": "Question",
      name: "\u00bfLos precios incluyen IVA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, todos los precios publicados en nuestro sitio est\u00e1n expresados en pesos chilenos (CLP) sin IVA, salvo que se indique lo contrario.",
      },
    },
    {
      "@type": "Question",
      name: "\u00bfTienen garant\u00eda los productos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "S\u00ed, todos nuestros productos cuentan con garant\u00eda legal seg\u00fan la legislaci\u00f3n chilena. Si recibes un producto defectuoso puedes solicitar cambio o devoluci\u00f3n dentro de los primeros 10 d\u00edas h\u00e1biles.",
      },
    },
  ],
};

export default function ContactoPage() {
  return (
    <div className="bg-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contacto</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Contacto</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-dark mb-6">Env&iacute;anos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Tel&eacute;fono</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="+569 xxxx xxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Mensaje</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Escribe tu consulta aqu&iacute;..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 text-sm uppercase tracking-wide transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-dark mb-4 uppercase tracking-wide text-sm">
                Informaci&oacute;n de contacto
              </h3>
              <div className="space-y-4">
                <a
                  href="https://wa.me/"
                  className="flex items-center gap-3 text-dark/70 hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Tel&eacute;fono / WhatsApp</p>
                    <p className="text-sm text-dark/60">+569 xxxx xxxx</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-dark/70">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Email</p>
                    <p className="text-sm text-dark/60">ventas@recambiospa.cl</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-dark/70">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Direcci&oacute;n</p>
                    <p className="text-sm text-dark/60">Santiago, Chile</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-dark/70">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Horario</p>
                    <p className="text-sm text-dark/60">Lunes a Viernes: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-dark text-white p-6">
              <h3 className="font-bold mb-2">Cotizaciones r&aacute;pidas</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Para cotizaciones r&aacute;pidas, escr&iacute;benos directamente por WhatsApp
                con el nombre o c&oacute;digo del producto que necesitas.
              </p>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {[
              { q: "\u00bfHacen env\u00edos a todo Chile?", a: "S\u00ed, realizamos env\u00edos a todas las regiones de Chile. Los costos y plazos de env\u00edo var\u00edan seg\u00fan la ubicaci\u00f3n de destino." },
              { q: "\u00bfC\u00f3mo puedo cotizar un producto?", a: "Puedes cotizar a trav\u00e9s de nuestro formulario de contacto, por WhatsApp o enviando un email a ventas@recambiospa.cl con el nombre o c\u00f3digo del producto." },
              { q: "\u00bfQu\u00e9 formas de pago aceptan?", a: "Aceptamos transferencia bancaria. El pedido ser\u00e1 procesado una vez confirmado el pago." },
              { q: "\u00bfLos precios incluyen IVA?", a: "No, todos los precios publicados est\u00e1n en pesos chilenos (CLP) sin IVA, salvo que se indique lo contrario." },
              { q: "\u00bfTienen garant\u00eda los productos?", a: "S\u00ed, todos nuestros productos cuentan con garant\u00eda legal seg\u00fan la legislaci\u00f3n chilena. Si recibes un producto defectuoso puedes solicitar cambio o devoluci\u00f3n dentro de los primeros 10 d\u00edas h\u00e1biles." },
            ].map((item) => (
              <details
                key={item.q}
                className="bg-white border border-gray-200 group"
              >
                <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-dark hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-steel group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <p className="px-6 pb-4 text-sm text-dark/70 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
