import type { Metadata } from "next";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandsSection from "@/components/BrandsSection";
import TechnicalServiceSection from "@/components/TechnicalServiceSection";
import { WHATSAPP_DISPLAY_NUMBER } from "@/lib/contact";
import {
  DEFAULT_SOCIAL_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Recambio SpA | Repuestos, Accesorios y Servicio T\u00e9cnico en Chile",
  description:
    "Compra repuestos, iluminaci\u00f3n LED, bater\u00edas, adhesivos, herramientas y servicio t\u00e9cnico para veh\u00edculos livianos y pesados. Braslux, Loctite, Teroson, Moura, Wurth y env\u00edos a todo Chile.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Recambio SpA | Repuestos, Accesorios y Servicio T\u00e9cnico en Chile",
    description: DEFAULT_SOCIAL_DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    title: "Recambio SpA | Repuestos, Accesorios y Servicio T\u00e9cnico en Chile",
    description: DEFAULT_SOCIAL_DESCRIPTION,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  description:
    "Importaci\u00f3n y distribuci\u00f3n de repuestos, accesorios e insumos para veh\u00edculos livianos y pesados, con servicio t\u00e9cnico especializado y env\u00edos a todo Chile.",
  url: SITE_URL,
  logo: absoluteUrl("/logo.svg"),
  image: absoluteUrl("/banners/banner1-new.png"),
  telephone: WHATSAPP_DISPLAY_NUMBER,
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
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-CL",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/collections?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Repuestos, accesorios y servicio t\u00e9cnico para transporte en Chile",
  description: DEFAULT_SOCIAL_DESCRIPTION,
  inLanguage: "es-CL",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  primaryImageOfPage: absoluteUrl("/banners/banner1-new.png"),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <HeroBanner />
      <section className="relative overflow-hidden border-b border-gray-200 bg-[linear-gradient(180deg,#f8f3eb_0%,#ffffff_72%)]">
        <div className="absolute left-1/3 top-12 h-40 w-40 rounded-full bg-primary-dark/4 blur-3xl" />
        <div className="absolute right-[-5rem] top-0 h-56 w-56 rounded-full bg-primary/7 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] lg:gap-16">
            <div className="max-w-4xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-primary">
                Recambio SpA
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase tracking-tight text-primary-dark sm:text-5xl lg:text-[4.45rem] lg:leading-[0.92]">
                Repuestos y accesorios para transporte en todo Chile
              </h1>
              <div className="mt-6 h-px w-20 bg-primary/30" />
              <p className="mt-6 max-w-3xl text-base leading-8 text-dark/66">
                Cat&aacute;logo para veh&iacute;culos livianos y pesados, con marcas l&iacute;deres,
                soporte t&eacute;cnico especializado y cotizaciones r&aacute;pidas para talleres,
                flotas y clientes particulares.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary-light"
                >
                  Ver cat&aacute;logo
                </Link>
                <Link
                  href="/servicio-tecnico"
                  className="inline-flex items-center justify-center border border-primary-dark/12 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-primary-dark transition-colors hover:border-primary hover:text-primary"
                >
                  Ver servicio t&eacute;cnico
                </Link>
              </div>
            </div>

            <div className="grid content-start gap-6 lg:pt-3">
              <div className="border-l-2 border-primary pl-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  Cobertura
                </p>
                <p className="mt-3 text-2xl font-black uppercase tracking-tight text-primary-dark">
                  Env&iacute;os a todo Chile
                </p>
                <p className="mt-2 text-sm leading-6 text-dark/60">
                  Despachos para regiones, talleres y flotas con seguimiento y respuesta comercial r&aacute;pida.
                </p>
              </div>

              <div className="border-l-2 border-primary-dark/14 pl-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  Cat&aacute;logo
                </p>
                <p className="mt-3 text-lg font-black uppercase tracking-tight text-primary-dark">
                  Veh&iacute;culos livianos y pesados
                </p>
              </div>

              <div className="border-l-2 border-primary-dark pl-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  Soporte
                </p>
                <p className="mt-3 text-lg font-black uppercase tracking-tight text-primary-dark">
                  Servicio t&eacute;cnico especializado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CategoryCards />
      <FeaturedProducts />
      <BrandsSection />
      <TechnicalServiceSection />

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide mb-6">
            Repuestos y Accesorios para Transporte en Chile
          </h2>
          <div className="grid gap-8 text-sm leading-relaxed text-dark/70 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-base font-bold text-dark">
                Distribuidor de Repuestos para Veh&iacute;culos Pesados y Livianos
              </h3>
              <p className="mb-3">
                En <strong>Recambio SpA</strong>{" "}somos especialistas en la
                importaci&oacute;n y distribuci&oacute;n de repuestos, accesorios e insumos
                para camiones, buses, autos y camionetas. Trabajamos con las marcas
                m&aacute;s reconocidas del mercado: <strong>Braslux</strong> en
                iluminaci&oacute;n LED, <strong>Loctite</strong> y <strong>Teroson</strong>{" "}
                en adhesivos y selladores, <strong>Moura</strong> en bater&iacute;as
                de alto rendimiento, <strong>Wurth</strong> en herramientas
                profesionales y <strong>Optibelt</strong> en correas de transmisi&oacute;n.
              </p>
              <p>
                Nuestro cat&aacute;logo incluye focos LED para camiones, bater&iacute;as
                para veh&iacute;culos pesados, amarras de carga, extintores vehiculares,
                componentes el&eacute;ctricos, herramientas de taller y productos qu&iacute;micos
                profesionales. Todo con env&iacute;os a lo largo de Chile.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-base font-bold text-dark">
                Env&iacute;os a Todo Chile
              </h3>
              <p className="mb-3">
                Realizamos despachos a todas las regiones del pa&iacute;s: desde Arica
                hasta Punta Arenas. Nuestro compromiso es entregar productos de calidad
                en el menor tiempo posible, con embalaje seguro y seguimiento de env&iacute;o.
              </p>
              <h3 className="mb-3 text-base font-bold text-dark">
                Atenci&oacute;n Personalizada
              </h3>
              <p>
                Nuestro equipo de ventas est&aacute; disponible para asesorarte en la
                elecci&oacute;n del repuesto correcto para tu veh&iacute;culo. Consulta por
                WhatsApp, email o a trav&eacute;s de nuestro formulario de contacto.
                Cotizaciones r&aacute;pidas y precios competitivos para talleres, flotas
                y clientes particulares.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
