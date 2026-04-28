import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { products, categories, brands, formatPrice } from "@/data/products";
import CollectionGrid from "./CollectionGrid";

const SITE_URL = "https://recambiospa.cl";

type CategorySEO = {
  title: string;
  description: string;
  h1: string;
  intro: string;
};

const categorySEO: Record<string, CategorySEO> = {
  iluminacion: {
    title: "Iluminaci\u00f3n LED para Camiones, Buses y Veh\u00edculos",
    description:
      "Focos LED, faros, luces laterales, traseras y de posici\u00f3n para veh\u00edculos pesados y livianos. Marcas Braslux, homologadas para transporte en Chile. Env\u00edos a todo el pa\u00eds.",
    h1: "Iluminaci\u00f3n LED para Transporte",
    intro:
      "Encuentra la m\u00e1s amplia variedad de focos LED, faros, luces laterales, de posici\u00f3n, freno, retroceso e intermitentes para camiones, buses y veh\u00edculos livianos. Trabajamos con Braslux, l\u00edder en iluminaci\u00f3n vehicular, con productos homologados que cumplen la normativa chilena vigente.",
  },
  baterias: {
    title: "Bater\u00edas Moura para Camiones y Veh\u00edculos Pesados",
    description:
      "Bater\u00edas Moura de alto rendimiento 150Ah y 220Ah para camiones, buses y maquinaria pesada. Distribuidor oficial en Chile con env\u00edos a todo el pa\u00eds.",
    h1: "Bater\u00edas para Veh\u00edculos Pesados y Livianos",
    intro:
      "Bater\u00edas de alto rendimiento Moura para todo tipo de veh\u00edculos. Desde bater\u00edas de 150Ah hasta 220Ah para camiones, buses y maquinaria pesada. Garant\u00eda de f\u00e1brica y despacho a todo Chile.",
  },
  amarras: {
    title: "Amarras de Carga para Transporte - Cintas y Tensores",
    description:
      "Amarras de carga, cintas de sujeci\u00f3n y tensores para transporte de mercanc\u00edas. Cumple normativa de seguridad vial chilena. Env\u00edos a todo Chile.",
    h1: "Amarras de Carga y Sujeci\u00f3n",
    intro:
      "Amarras de carga profesionales para asegurar mercanc\u00edas en camiones y remolques. Cintas de sujeci\u00f3n con tensores de alta resistencia que cumplen con la normativa de seguridad vial vigente en Chile.",
  },
  herramientas: {
    title: "Herramientas Profesionales Wurth para Taller Mec\u00e1nico",
    description:
      "Herramientas profesionales Wurth: brocas, discos de corte, carros de taller y m\u00e1s. Calidad alemana para talleres mec\u00e1nicos y flotas de transporte.",
    h1: "Herramientas Profesionales para Taller",
    intro:
      "Herramientas de calidad profesional para talleres mec\u00e1nicos y mantenci\u00f3n de flotas. Brocas, discos de corte, carros de taller y m\u00e1s de marcas reconocidas como Wurth.",
  },
  extintores: {
    title: "Extintores para Camiones y Veh\u00edculos de Transporte",
    description:
      "Extintores homologados para veh\u00edculos de transporte. Cumple normativa chilena obligatoria para camiones y buses. Env\u00edos a todo Chile.",
    h1: "Extintores Vehiculares",
    intro:
      "Extintores certificados y homologados para veh\u00edculos de transporte, cumpliendo con la normativa obligatoria chilena. Indispensables para camiones, buses y veh\u00edculos de carga.",
  },
  calefaccion: {
    title: "Sistemas de Calefacci\u00f3n para Veh\u00edculos de Transporte",
    description:
      "Calefactores y sistemas de climatizaci\u00f3n para cabinas de camiones y buses. Productos de alta calidad con env\u00edos a todo Chile.",
    h1: "Calefacci\u00f3n Vehicular",
    intro:
      "Sistemas de calefacci\u00f3n para cabinas de camiones y buses. Calefactores de alta eficiencia para mantener la temperatura ideal durante la conducci\u00f3n en condiciones de fr\u00edo extremo.",
  },
  electrico: {
    title: "Componentes El\u00e9ctricos para Veh\u00edculos - Sensores, Rel\u00e9s, Fusibles",
    description:
      "Sensores, rel\u00e9s, fusibles, switches y componentes el\u00e9ctricos para camiones y veh\u00edculos. Marcas Danval y 3-RHO. Env\u00edos a todo Chile.",
    h1: "Componentes El\u00e9ctricos Vehiculares",
    intro:
      "Componentes el\u00e9ctricos para el sistema el\u00e9ctrico de tu veh\u00edculo: sensores, rel\u00e9s, fusibles, switches y v\u00e1lvulas electromec\u00e1nicas. Trabajamos con Danval y 3-RHO, marcas especializadas en el rubro.",
  },
  seguridad: {
    title: "Elementos de Seguridad para Veh\u00edculos de Transporte",
    description:
      "Guantes, elementos de protecci\u00f3n personal y seguridad vial para conductores y talleres. Productos certificados con env\u00edos a todo Chile.",
    h1: "Seguridad Vehicular y Protecci\u00f3n Personal",
    intro:
      "Elementos de seguridad y protecci\u00f3n personal para conductores profesionales y talleres mec\u00e1nicos. Guantes, equipos de protecci\u00f3n y accesorios de seguridad vial certificados.",
  },
  adhesivos: {
    title: "Adhesivos y Selladores Loctite y Teroson para Veh\u00edculos",
    description:
      "Adhesivos, selladores, siliconas y trabadores de perno Loctite y Teroson. Productos qu\u00edmicos profesionales para mantenimiento vehicular. Env\u00edos a todo Chile.",
    h1: "Adhesivos y Selladores Profesionales",
    intro:
      "L\u00ednea completa de adhesivos, selladores, siliconas, trabadores de perno y productos qu\u00edmicos Loctite y Teroson para mantenimiento y reparaci\u00f3n vehicular. Soluciones profesionales de Henkel para talleres y flotas.",
  },
  "kit-especiales": {
    title: "Kits Especiales de Repuestos para Veh\u00edculos",
    description:
      "Kits de repuestos especiales para mantenimiento y reparaci\u00f3n de veh\u00edculos pesados y livianos. Conjuntos completos listos para instalar.",
    h1: "Kits Especiales de Repuestos",
    intro:
      "Kits de repuestos pre-armados para mantenci\u00f3n y reparaci\u00f3n vehicular. Conjuntos completos con todas las piezas necesarias, listos para instalar en tu taller.",
  },
  generales: {
    title: "Repuestos Generales para Veh\u00edculos de Transporte",
    description:
      "Repuestos generales y accesorios para veh\u00edculos livianos y pesados. Amplio cat\u00e1logo de productos con env\u00edos a todo Chile.",
    h1: "Repuestos Generales",
    intro:
      "Cat\u00e1logo de repuestos generales y accesorios para veh\u00edculos de transporte. Productos de calidad para mantener tu flota en \u00f3ptimas condiciones.",
  },
  otros: {
    title: "Lubricantes, Correas y Otros Insumos para Veh\u00edculos",
    description:
      "Lubricantes, correas de transmisi\u00f3n Optibelt, aflojadores, grasas y otros insumos para mantenimiento vehicular. Env\u00edos a todo Chile.",
    h1: "Lubricantes, Correas y Otros Insumos",
    intro:
      "Lubricantes, correas de transmisi\u00f3n Optibelt, aflojadores, grasas y otros productos de mantenimiento para veh\u00edculos livianos y pesados.",
  },
};

const brandSEO: Record<string, CategorySEO> = {
  braslux: {
    title: "Productos Braslux - Iluminaci\u00f3n LED Vehicular",
    description:
      "Cat\u00e1logo completo de focos LED Braslux: luces laterales, traseras, de posici\u00f3n y freno para camiones y buses. Distribuidor oficial en Chile.",
    h1: "Braslux - Iluminaci\u00f3n LED Vehicular",
    intro:
      "Braslux es l\u00edder en iluminaci\u00f3n LED para veh\u00edculos de transporte. Focos de posici\u00f3n, freno, retroceso, intermitentes y laterales con tecnolog\u00eda LED de alta durabilidad y bajo consumo energ\u00e9tico. Todos nuestros productos Braslux est\u00e1n homologados para uso en camiones y buses en Chile.",
  },
  loctite: {
    title: "Productos Loctite - Adhesivos y Qu\u00edmicos Profesionales",
    description:
      "Adhesivos, trabadores de perno, selladores, siliconas, lubricantes y limpiadores Loctite. Distribuidor en Chile con env\u00edos a todo el pa\u00eds.",
    h1: "Loctite - Adhesivos y Productos Qu\u00edmicos",
    intro:
      "L\u00ednea completa de productos Loctite para mantenimiento y reparaci\u00f3n vehicular: trabadores de perno (242, 243), adhesivos instant\u00e1neos (495), siliconas RTV, lubricantes multiuso, limpia contactos y m\u00e1s. Soluciones industriales de Henkel para talleres profesionales.",
  },
  teroson: {
    title: "Productos Teroson - Selladores de Carrocer\u00eda",
    description:
      "Selladores de carrocer\u00eda, adhesivos estructurales y productos Teroson para reparaci\u00f3n vehicular. Distribuidor en Chile.",
    h1: "Teroson - Selladores y Adhesivos de Carrocer\u00eda",
    intro:
      "Productos Teroson de Henkel para sellado y reparaci\u00f3n de carrocer\u00edas: selladores de poliuretano, adhesivos estructurales y productos de protecci\u00f3n. Calidad profesional para talleres de carrocer\u00eda y pintura.",
  },
  wurth: {
    title: "Productos Wurth - Herramientas y Qu\u00edmicos Profesionales",
    description:
      "Herramientas, brocas, discos de corte, grasas y productos qu\u00edmicos Wurth. Calidad alemana para talleres mec\u00e1nicos. Env\u00edos a todo Chile.",
    h1: "Wurth - Herramientas y Productos Profesionales",
    intro:
      "Herramientas y productos qu\u00edmicos Wurth de calidad alemana para talleres mec\u00e1nicos y profesionales del transporte. Brocas, discos de corte, grasas especiales y m\u00e1s.",
  },
  moura: {
    title: "Bater\u00edas Moura - Alto Rendimiento para Transporte",
    description:
      "Bater\u00edas Moura de 150Ah y 220Ah para camiones, buses y veh\u00edculos pesados. Distribuidor en Chile con garant\u00eda de f\u00e1brica.",
    h1: "Moura - Bater\u00edas de Alto Rendimiento",
    intro:
      "Bater\u00edas Moura de alto rendimiento para veh\u00edculos pesados y livianos. L\u00ednea completa desde 150Ah hasta 220Ah, con tecnolog\u00eda de \u00faltima generaci\u00f3n y garant\u00eda de f\u00e1brica. Moura es una de las marcas m\u00e1s reconocidas en bater\u00edas para transporte en Sudam\u00e9rica.",
  },
  danval: {
    title: "Productos Danval - Componentes El\u00e9ctricos Vehiculares",
    description:
      "Sensores, rel\u00e9s, fusibles y componentes el\u00e9ctricos Danval para camiones y veh\u00edculos. Distribuidor en Chile.",
    h1: "Danval - Componentes El\u00e9ctricos",
    intro:
      "Componentes el\u00e9ctricos Danval para veh\u00edculos de transporte: sensores, rel\u00e9s, fusibles y switches. Piezas de calidad para el sistema el\u00e9ctrico de camiones y buses.",
  },
  optibelt: {
    title: "Correas Optibelt - Transmisi\u00f3n de Alta Calidad",
    description:
      "Correas de transmisi\u00f3n Optibelt de alta calidad y durabilidad para veh\u00edculos pesados y livianos. Distribuidor en Chile.",
    h1: "Optibelt - Correas de Transmisi\u00f3n",
    intro:
      "Correas de transmisi\u00f3n Optibelt de fabricaci\u00f3n alemana. Alta calidad, durabilidad y rendimiento para veh\u00edculos pesados, livianos y maquinaria industrial.",
  },
  henkel: {
    title: "Productos Henkel - Loctite y Teroson",
    description:
      "L\u00ednea completa de productos Henkel: adhesivos Loctite, selladores Teroson y soluciones qu\u00edmicas para mantenimiento vehicular. Distribuidor en Chile.",
    h1: "Henkel - Soluciones Adhesivas y Qu\u00edmicas",
    intro:
      "Henkel es la empresa matriz de Loctite y Teroson, ofreciendo soluciones adhesivas y qu\u00edmicas de clase mundial para la industria automotriz y de transporte.",
  },
  mobileye: {
    title: "Mobileye - Tecnolog\u00eda de Seguridad Vehicular ADAS",
    description:
      "Sistemas de seguridad avanzada Mobileye (ADAS) para flotas de transporte. Prevenci\u00f3n de colisiones y alertas para conductores.",
    h1: "Mobileye - Seguridad Vehicular Avanzada",
    intro:
      "Tecnolog\u00eda ADAS (Advanced Driver Assistance Systems) de Mobileye para flotas de transporte. Sistemas de prevenci\u00f3n de colisiones, alertas de cambio de carril y detecci\u00f3n de peatones.",
  },
  "3-rho": {
    title: "Productos 3-RHO - Sensores y Componentes El\u00e9ctricos",
    description:
      "Sensores de temperatura, presi\u00f3n y otros componentes el\u00e9ctricos 3-RHO para veh\u00edculos. Distribuidor en Chile.",
    h1: "3-RHO - Sensores Vehiculares",
    intro:
      "Sensores y componentes el\u00e9ctricos 3-RHO para veh\u00edculos de transporte. Sensores de temperatura, presi\u00f3n de aceite y m\u00e1s.",
  },
  "recambio spa": {
    title: "Productos Recambio SpA - Repuestos y Accesorios",
    description:
      "Productos propios Recambio SpA: repuestos y accesorios seleccionados para veh\u00edculos de transporte. Calidad garantizada.",
    h1: "Recambio SpA - Productos Propios",
    intro:
      "Selecci\u00f3n de repuestos y accesorios con la garant\u00eda de calidad Recambio SpA para veh\u00edculos livianos y pesados.",
  },
};

function findSlugData(slug: string) {
  // Check categories first
  const category = categories.find((c) => c.id === slug);
  if (category) {
    const seo = categorySEO[slug];
    const filtered = products.filter((p) => p.category === slug);
    return { type: "category" as const, name: category.name, seo, products: filtered, slug };
  }

  // Check brands
  const brand = brands.find((b) => b.toLowerCase() === slug.toLowerCase());
  if (brand) {
    const seo = brandSEO[slug.toLowerCase()];
    const filtered = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    return { type: "brand" as const, name: brand, seo, products: filtered, slug };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = findSlugData(slug);

  if (!data || !data.seo) {
    return { title: "Cat\u00e1logo de Productos" };
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: `${SITE_URL}/collections/${slug}`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  const categoryParams = categories.map((c) => ({ slug: c.id }));
  const brandParams = brands.map((b) => ({ slug: b.toLowerCase() }));
  return [...categoryParams, ...brandParams];
}

export default async function CollectionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = findSlugData(slug);

  if (!data) {
    notFound();
  }

  const { seo, name, type: collectionType } = data;
  const fallbackSeo: CategorySEO = {
    title: name,
    description: `Productos ${name} en Recambio SpA`,
    h1: name,
    intro: `Explora nuestra selecci\u00f3n de productos ${name}.`,
  };
  const s = seo || fallbackSeo;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: s.h1,
    description: s.description,
    url: `${SITE_URL}/collections/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.products.length,
      itemListElement: data.products.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/producto/${p.code}`,
        name: p.name,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Cat\u00e1logo", item: `${SITE_URL}/collections` },
      { "@type": "ListItem", position: 3, name: name, item: `${SITE_URL}/collections/${slug}` },
    ],
  };

  return (
    <div className="bg-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Page header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link href="/collections" className="hover:text-white transition-colors">Cat&aacute;logo</Link>
            <ChevronRight size={14} />
            <span className="text-white">{name}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{s.h1}</h1>
          <p className="text-white/60 text-sm mt-1">
            {data.products.length} producto{data.products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* SEO intro text */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="text-sm text-dark/70 leading-relaxed">{s.intro}</p>
        </div>

        {/* Product grid */}
        <CollectionGrid products={data.products} />

        {/* Related categories / cross-links for SEO */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-dark uppercase tracking-wide mb-4">
            {collectionType === "category" ? "Otras Categor\u00edas" : "Otras Marcas"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {collectionType === "category"
              ? categories
                  .filter((c) => c.id !== slug)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/collections/${c.id}`}
                      className="bg-white border border-gray-200 px-4 py-2 text-sm text-dark/70 hover:border-primary hover:text-primary transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))
              : brands
                  .filter((b) => b.toLowerCase() !== slug.toLowerCase())
                  .map((b) => (
                    <Link
                      key={b}
                      href={`/collections/${b.toLowerCase()}`}
                      className="bg-white border border-gray-200 px-4 py-2 text-sm text-dark/70 hover:border-primary hover:text-primary transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
}
