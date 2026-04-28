import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Contacto - Cotizaciones y Consultas",
  description:
    "Contáctanos para cotizaciones de repuestos y accesorios para transporte. Atención por WhatsApp, email y formulario. Santiago, Chile.",
  alternates: { canonical: "/contacto" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Hacen envíos a todo Chile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, realizamos envíos a todas las regiones de Chile. Los costos y plazos varían según la ubicación de destino.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo cotizar un producto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes cotizar a través de nuestro formulario de contacto, por WhatsApp o enviando un email a ventas@recambiospa.cl con el nombre o código del producto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué formas de pago aceptan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceptamos transferencia bancaria. El pedido será procesado una vez confirmado el pago.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los precios incluyen IVA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, todos los precios están en pesos chilenos (CLP) sin IVA, salvo que se indique lo contrario.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tienen garantía los productos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, todos nuestros productos cuentan con garantía legal según la legislación chilena. Si recibes un producto defectuoso puedes solicitar cambio o devolución dentro de los primeros 10 días hábiles.",
      },
    },
  ],
};

const faqs = [
  {
    q: "¿Hacen envíos a todo Chile?",
    a: "Sí, realizamos envíos a todas las regiones de Chile. Los costos y plazos varían según la ubicación de destino.",
  },
  {
    q: "¿Cómo puedo cotizar un producto?",
    a: "Puedes cotizar a través de nuestro formulario, por WhatsApp o enviando un email a ventas@recambiospa.cl con el nombre o código del producto.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Aceptamos transferencia bancaria. El pedido se procesa una vez confirmado el pago.",
  },
  {
    q: "¿Los precios incluyen IVA?",
    a: "No, todos los precios están en pesos chilenos (CLP) sin IVA, salvo que se indique lo contrario.",
  },
  {
    q: "¿Tienen garantía los productos?",
    a: "Sí, con garantía legal según la legislación chilena. Cambio o devolución disponible dentro de los primeros 10 días hábiles si el producto es defectuoso.",
  },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────── */}
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Contacto" },
        ]}
        title="Contacto"
      />

      {/* ── MAIN ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8">

          {/* ── FORM ───────────────────────────────── */}
          <div className="bg-white border border-gray-200 p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Formulario</p>
            <h2 className="text-xl font-black text-dark uppercase mb-6">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-gray-50 focus:bg-white transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-gray-50 focus:bg-white transition-colors"
                  placeholder="+569 xxxx xxxx"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-1.5">
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-gray-50 focus:bg-white transition-colors resize-none"
                  placeholder="Nombre o código del producto que necesitas..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 text-xs uppercase tracking-widest transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* ── CONTACT INFO ───────────────────────── */}
          <div className="flex flex-col gap-px">

            {/* Dark info block */}
            <div className="bg-primary-dark text-white p-8 flex-1">
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                Datos de contacto
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Email</p>
                  <a
                    href="mailto:ventas@recambiospa.cl"
                    className="text-white font-semibold hover:text-primary transition-colors"
                  >
                    ventas@recambiospa.cl
                  </a>
                </div>
                <div>
                  <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/"
                    className="text-white font-semibold hover:text-primary transition-colors"
                  >
                    +569 xxxx xxxx
                  </a>
                </div>
                <div>
                  <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Horario</p>
                  <p className="text-white">Lun – Vie &nbsp; 9:00 – 18:00</p>
                </div>
                <div>
                  <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Ubicación</p>
                  <p className="text-white">Santiago, Chile</p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-white/50 text-xs mb-3">
                  La forma más rápida de cotizar es por WhatsApp.
                </p>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black px-5 py-3 text-xs uppercase tracking-widest transition-colors"
                >
                  {/* WhatsApp SVG */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Cotizar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────── */}
        <div className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">FAQ</p>
          <h2 className="text-xl font-black text-dark uppercase tracking-tight mb-6">
            Preguntas frecuentes
          </h2>
          <div className="divide-y divide-gray-200 border border-gray-200 bg-white">
            {faqs.map((item) => (
              <details key={item.q} className="group">
                <summary className="px-6 py-4 cursor-pointer text-sm font-bold text-dark hover:text-primary transition-colors list-none flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-steel flex-shrink-0 group-open:rotate-180 transition-transform duration-200">
                    &#9662;
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm text-dark/60 leading-relaxed border-t border-gray-100">
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
