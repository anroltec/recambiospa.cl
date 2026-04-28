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

const categories: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "AMARRAS",       href: "/collections/amarras",      icon: Link2           },
  { name: "BATERÍAS",      href: "/collections/baterias",     icon: Battery         },
  { name: "CALEFACCIÓN",   href: "/collections/calefaccion",  icon: Flame           },
  { name: "EXTINTORES",    href: "/collections/extintores",   icon: FireExtinguisher },
  { name: "HERRAMIENTAS",  href: "/collections/herramientas", icon: Wrench          },
  { name: "ILUMINACIÓN",   href: "/collections/iluminacion",  icon: Zap             },
  { name: "KIT ESPECIALES",href: "/collections/kit-especiales", icon: Package2      },
  { name: "OTROS",         href: "/collections/otros",        icon: Box             },
];

export default function CategoryCards() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-dark mb-8 uppercase tracking-wide">
          Nuestras Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex items-center gap-3 border border-gray-200 px-4 py-4 hover:border-primary hover:bg-primary transition-all duration-200"
              >
                {/* Category icon */}
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
