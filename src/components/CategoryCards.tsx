import Link from "next/link";
import {
  Link2,
  Battery,
  Flame,
  FireExtinguisher,
  Wrench,
  Zap,
  Package2,
  Box,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCatalogData } from "@/lib/catalog";

const ALL_CATEGORIES: { id: string; name: string; href: string; icon: LucideIcon }[] = [
  { id: "amarras",      name: "AMARRAS",        href: "/collections/amarras",      icon: Link2 },
  { id: "baterias",     name: "BATERÍAS",        href: "/collections/baterias",     icon: Battery },
  { id: "calefaccion",  name: "CALEFACCIÓN",     href: "/collections/calefaccion",  icon: Flame },
  { id: "extintores",   name: "EXTINTORES",      href: "/collections/extintores",   icon: FireExtinguisher },
  { id: "herramientas", name: "HERRAMIENTAS",    href: "/collections/herramientas", icon: Wrench },
  { id: "iluminacion",  name: "ILUMINACIÓN",     href: "/collections/iluminacion",  icon: Zap },
  { id: "kit-especiales", name: "KITS ESPECIALES", href: "/collections/kit-especiales", icon: Package2 },
  { id: "otros",        name: "OTROS",           href: "/collections/otros",        icon: Box },
];

export default async function CategoryCards() {
  let populatedIds: Set<string>;

  try {
    const { products } = await getCatalogData();
    populatedIds = new Set(products.map((p) => p.category));
  } catch {
    // Si el catálogo falla, mostramos todas para no romper la homepage
    populatedIds = new Set(ALL_CATEGORIES.map((c) => c.id));
  }

  const visibleCategories = ALL_CATEGORIES.filter((c) => populatedIds.has(c.id));

  if (visibleCategories.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-dark mb-8 uppercase tracking-wide">
          Nuestras Categor&iacute;as
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex items-center gap-3 border border-gray-200 px-4 py-4 hover:border-primary hover:bg-primary transition-all duration-200"
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className="flex-shrink-0 text-primary group-hover:text-white transition-colors duration-200"
                />
                <span className="flex-1 text-sm font-bold text-dark tracking-wide group-hover:text-white transition-colors duration-200">
                  {cat.name}
                </span>
                <ArrowRight
                  size={14}
                  className="flex-shrink-0 text-steel/50 group-hover:text-white transition-colors duration-200"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
