import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { brandLogos } from "@/data/brands";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Marcas | Recambio SPA",
  description: "Distribuidores oficiales de las principales marcas de repuestos y accesorios para transporte.",
};

export default function MarcasPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Marcas</span>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <div className="bg-primary-dark text-white py-14">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">Nuestras Marcas</h1>
          <p className="text-white/70 text-sm max-w-xl">
            Distribuimos productos de las marcas líderes en el mercado automotriz y de transporte.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brandLogos.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all p-6 flex flex-col items-center gap-4"
            >
              <div className="relative w-full h-16 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="200px"
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wide group-hover:gap-2 transition-all">
                {brand.name}
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          ¿Buscas una marca que no está aquí?{" "}
          <Link href="/contacto" className="text-primary hover:underline font-medium">
            Contáctanos
          </Link>
        </p>
      </Container>
    </div>
  );
}
