import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalogCategories } from "@/data/navigation";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CategoryCards() {
  return (
    <section className="py-14 bg-white">
      <Container>
        <SectionHeader title="Nuestras Categorías" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {catalogCategories.map((cat) => (
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
      </Container>
    </section>
  );
}
