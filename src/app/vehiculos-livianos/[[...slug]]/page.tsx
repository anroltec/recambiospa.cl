import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products, categories, formatPrice } from "@/data/products";
import CollectionGrid from "@/app/collections/[slug]/CollectionGrid";

const SITE_URL = "https://recambiospa.cl";

const subcategories: Record<string, { category: string; title: string; h1: string; description: string; intro: string }> = {
  seguridad: {
    category: "seguridad",
    title: "Seguridad para Veh\u00edculos Livianos",
    h1: "Seguridad para Veh\u00edculos Livianos",
    description: "Elementos de seguridad, protecci\u00f3n personal y accesorios de seguridad vial para autos, camionetas y SUV. Env\u00edos a todo Chile.",
    intro: "Elementos de seguridad para veh\u00edculos livianos: guantes, kits de emergencia y accesorios de protecci\u00f3n personal para conductores.",
  },
  electrico: {
    category: "electrico",
    title: "Componentes El\u00e9ctricos para Veh\u00edculos Livianos",
    h1: "El\u00e9ctrico - Veh\u00edculos Livianos",
    description: "Sensores, rel\u00e9s, fusibles y componentes el\u00e9ctricos para autos, camionetas y veh\u00edculos livianos. Env\u00edos a todo Chile.",
    intro: "Componentes del sistema el\u00e9ctrico para veh\u00edculos livianos: sensores, rel\u00e9s, fusibles, switches y v\u00e1lvulas.",
  },
  herramientas: {
    category: "herramientas",
    title: "Herramientas para Mantenci\u00f3n de Veh\u00edculos Livianos",
    h1: "Herramientas - Veh\u00edculos Livianos",
    description: "Herramientas profesionales para mantenimiento de autos, camionetas y SUV. Brocas, discos de corte y m\u00e1s. Env\u00edos a todo Chile.",
    intro: "Herramientas profesionales para la mantenci\u00f3n de veh\u00edculos livianos. Brocas, discos de corte, llaves y m\u00e1s.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug && slug[0] && subcategories[slug[0]]) {
    const sub = subcategories[slug[0]];
    return {
      title: sub.title,
      description: sub.description,
      alternates: { canonical: `/vehiculos-livianos/${slug[0]}` },
    };
  }
  return {
    title: "Repuestos para Veh\u00edculos Livianos - Autos, Camionetas y SUV",
    description:
      "Repuestos, accesorios y herramientas para veh\u00edculos livianos: autos, camionetas, SUV y furgones. Seguridad, el\u00e9ctrico y herramientas. Env\u00edos a todo Chile.",
    alternates: { canonical: "/vehiculos-livianos" },
  };
}

export default async function VehiculosLivianosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  // Sub-category page
  if (slug && slug[0] && subcategories[slug[0]]) {
    const sub = subcategories[slug[0]];
    const filtered = products.filter((p) => p.category === sub.category);
    return (
      <div className="bg-light min-h-screen">
        <div className="bg-primary-dark">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={14} />
              <Link href="/vehiculos-livianos" className="hover:text-white transition-colors">Veh&iacute;culos Livianos</Link>
              <ChevronRight size={14} />
              <span className="text-white">{sub.h1}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{sub.h1}</h1>
            <p className="text-white/60 text-sm mt-1">{filtered.length} productos</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <p className="text-sm text-dark/70 leading-relaxed">{sub.intro}</p>
          </div>
          <CollectionGrid products={filtered} />
        </div>
      </div>
    );
  }

  // Main landing page
  const lightCategories = ["seguridad", "electrico", "herramientas"];
  const lightProducts = products.filter((p) => lightCategories.includes(p.category));

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Veh&iacute;culos Livianos</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Repuestos para Veh&iacute;culos Livianos
          </h1>
          <p className="text-white/60 text-sm mt-1">{lightProducts.length} productos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="text-sm text-dark/70 leading-relaxed">
            Repuestos, accesorios y herramientas para veh&iacute;culos livianos: autos, camionetas, SUV y furgones.
            Encuentra componentes el&eacute;ctricos, elementos de seguridad y herramientas profesionales de las mejores marcas.
          </p>
        </div>

        {/* Sub-categories */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {Object.entries(subcategories).map(([key, sub]) => (
            <Link
              key={key}
              href={`/vehiculos-livianos/${key}`}
              className="bg-white border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <h2 className="font-bold text-dark group-hover:text-primary transition-colors mb-2">
                {sub.h1}
              </h2>
              <p className="text-sm text-dark/60 leading-relaxed line-clamp-2">{sub.intro}</p>
              <span className="inline-block mt-3 text-xs text-primary font-bold uppercase tracking-wider">
                Ver productos →
              </span>
            </Link>
          ))}
        </div>

        <CollectionGrid products={lightProducts} />
      </div>
    </div>
  );
}
