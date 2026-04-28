import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import CollectionGrid from "@/app/collections/[slug]/CollectionGrid";

const subcategories: Record<string, { categories: string[]; title: string; h1: string; description: string; intro: string }> = {
  "buses-camiones": {
    categories: ["iluminacion", "baterias", "amarras", "calefaccion"],
    title: "Repuestos para Buses y Camiones - Iluminaci\u00f3n, Bater\u00edas, Amarras",
    h1: "Repuestos para Buses y Camiones",
    description: "Iluminaci\u00f3n LED, bater\u00edas de alto rendimiento, amarras de carga y calefacci\u00f3n para buses y camiones. Despacho a todo Chile.",
    intro: "Repuestos esenciales para buses y camiones: iluminaci\u00f3n LED Braslux, bater\u00edas Moura, amarras de carga profesionales y sistemas de calefacci\u00f3n. Todo lo que tu flota necesita.",
  },
  otros: {
    categories: ["extintores", "kit-especiales", "generales", "otros"],
    title: "Otros Repuestos para Veh\u00edculos Pesados",
    h1: "Otros Repuestos para Veh\u00edculos Pesados",
    description: "Extintores, kits especiales, lubricantes, correas y otros insumos para veh\u00edculos pesados. Env\u00edos a todo Chile.",
    intro: "Complementa tu inventario con extintores vehiculares, kits de repuestos especiales, lubricantes, correas Optibelt y otros insumos esenciales para veh\u00edculos pesados.",
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
      alternates: { canonical: `/vehiculos-pesados/${slug[0]}` },
    };
  }
  return {
    title: "Repuestos para Veh\u00edculos Pesados - Camiones, Buses y Maquinaria",
    description:
      "Repuestos y accesorios para veh\u00edculos pesados: camiones, buses y maquinaria. Iluminaci\u00f3n LED, bater\u00edas, adhesivos, herramientas y m\u00e1s. Env\u00edos a todo Chile.",
    alternates: { canonical: "/vehiculos-pesados" },
  };
}

export default async function VehiculosPesadosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (slug && slug[0] && subcategories[slug[0]]) {
    const sub = subcategories[slug[0]];
    const filtered = products.filter((p) => sub.categories.includes(p.category));
    return (
      <div className="bg-light min-h-screen">
        <div className="bg-primary-dark">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={14} />
              <Link href="/vehiculos-pesados" className="hover:text-white transition-colors">Veh&iacute;culos Pesados</Link>
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
  const heavyProducts = products;

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Veh&iacute;culos Pesados</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Repuestos para Veh&iacute;culos Pesados
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Cat&aacute;logo completo para camiones, buses y maquinaria
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="text-sm text-dark/70 leading-relaxed">
            Cat&aacute;logo completo de repuestos y accesorios para veh&iacute;culos pesados: camiones, buses y maquinaria.
            Iluminaci&oacute;n LED Braslux, bater&iacute;as Moura, adhesivos Loctite y Teroson, herramientas Wurth, amarras de carga,
            extintores y mucho m&aacute;s. Todas las marcas l&iacute;deres con env&iacute;os a todo Chile.
          </p>
        </div>

        {/* Sub-categories */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {Object.entries(subcategories).map(([key, sub]) => (
            <Link
              key={key}
              href={`/vehiculos-pesados/${key}`}
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

        <CollectionGrid products={heavyProducts} />
      </div>
    </div>
  );
}
