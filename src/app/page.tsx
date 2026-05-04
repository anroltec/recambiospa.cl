import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandsSection from "@/components/BrandsSection";
import TechnicalServiceSection from "@/components/TechnicalServiceSection";

export const metadata: Metadata = {
  title: "Repuestos y Accesorios para Transporte | Env\u00edos a Todo Chile",
  description:
    "Compra online repuestos, iluminaci\u00f3n LED, bater\u00edas, adhesivos, herramientas y m\u00e1s para veh\u00edculos livianos y pesados. Braslux, Loctite, Teroson, Moura, Wurth. Despacho a todo Chile.",
  alternates: { canonical: "/" },
};

const SITE_URL = "https://recambiospa.cl";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Recambio SpA",
  description:
    "Importaci\u00f3n y distribuci\u00f3n de repuestos y accesorios para veh\u00edculos livianos y pesados. Env\u00edos a todo Chile.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: `${SITE_URL}/logo.svg`,
  email: "ventas@recambiospa.cl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressRegion: "Regi\u00f3n Metropolitana",
    addressCountry: "CL",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "$$",
  paymentAccepted: "Transferencia Bancaria",
  areaServed: {
    "@type": "Country",
    name: "Chile",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Recambio SpA",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/collections?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroBanner />
      <CategoryCards />
      <FeaturedProducts />
      <BrandsSection />
      <TechnicalServiceSection />

      {/* SEO content section - visible to crawlers, useful to users */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide mb-6">
            Repuestos y Accesorios para Transporte en Chile
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-dark/70 leading-relaxed">
            <div>
              <h3 className="font-bold text-dark text-base mb-3">
                Distribuidor de Repuestos para Veh&iacute;culos Pesados y Livianos
              </h3>
              <p className="mb-3">
                En <strong>Recambio SpA</strong>{" "}somos especialistas en la importaci&oacute;n y distribuci&oacute;n de
                repuestos, accesorios e insumos para camiones, buses, autos y camionetas.
                Trabajamos con las marcas m&aacute;s reconocidas del mercado:{" "}
                <strong>Braslux</strong> en iluminaci&oacute;n LED,{" "}
                <strong>Loctite</strong> y <strong>Teroson</strong> en adhesivos y selladores,{" "}
                <strong>Moura</strong> en bater&iacute;as de alto rendimiento,{" "}
                <strong>Wurth</strong> en herramientas profesionales y{" "}
                <strong>Optibelt</strong> en correas de transmisi&oacute;n.
              </p>
              <p>
                Nuestro cat&aacute;logo incluye focos LED para camiones, bater&iacute;as para veh&iacute;culos pesados,
                amarras de carga, extintores vehiculares, componentes el&eacute;ctricos, herramientas de taller
                y productos qu&iacute;micos profesionales. Todo con env&iacute;os a lo largo de Chile.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-dark text-base mb-3">
                Env&iacute;os a Todo Chile
              </h3>
              <p className="mb-3">
                Realizamos despachos a todas las regiones del pa&iacute;s: desde Arica hasta Punta Arenas.
                Nuestro compromiso es entregar productos de calidad en el menor tiempo posible,
                con embalaje seguro y seguimiento de env&iacute;o.
              </p>
              <h3 className="font-bold text-dark text-base mb-3">
                Atenci&oacute;n Personalizada
              </h3>
              <p>
                Nuestro equipo de ventas est&aacute; disponible para asesorarte en la elecci&oacute;n del
                repuesto correcto para tu veh&iacute;culo. Consulta por WhatsApp, email o a trav&eacute;s
                de nuestro formulario de contacto. Cotizaciones r&aacute;pidas y precios competitivos
                para talleres, flotas y clientes particulares.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
