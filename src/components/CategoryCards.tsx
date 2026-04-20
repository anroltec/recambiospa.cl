import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "AMARRAS", href: "/collections/amarras" },
  { name: "BATERÍAS", href: "/collections/baterias" },
  { name: "CALEFACCIÓN", href: "/collections/calefaccion" },
  { name: "EXTINTORES", href: "/collections/extintores" },
  { name: "HERRAMIENTAS", href: "/collections/herramientas" },
  { name: "ILUMINACIÓN", href: "/collections/iluminacion" },
  { name: "KIT ESPECIALES", href: "/collections/kit-especiales" },
  { name: "OTROS", href: "/collections/otros" },
];

export default function CategoryCards() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-dark mb-8 uppercase tracking-wide">
          Nuestras Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex items-center justify-between border border-gray-200 px-5 py-4 hover:border-primary hover:bg-primary transition-all"
            >
              <span className="text-sm font-bold text-dark tracking-wide group-hover:text-white transition-colors">
                {cat.name}
              </span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
