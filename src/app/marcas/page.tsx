import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Marcas - Braslux, Loctite, Teroson, Moura, Wurth y Más",
  description:
    "Distribuimos las mejores marcas de repuestos y accesorios: Braslux, Henkel, Loctite, Moura, Teroson, Wurth, Danval, Optibelt. Calidad garantizada en Chile.",
  alternates: { canonical: "/marcas" },
};

const allBrands = [
  { name: "Braslux", slug: "braslux", logo: "/brands/braslux.png", description: "L\u00edder en iluminaci\u00f3n LED para veh\u00edculos pesados y livianos." },
  { name: "Henkel", slug: "henkel", logo: "/brands/henkel.png", description: "Soluciones adhesivas y sellantes de clase mundial." },
  { name: "Loctite", slug: "loctite", logo: "/brands/loctite.png", description: "Adhesivos, selladores y productos qu\u00edmicos de alta performance." },
  { name: "Mobileye", slug: "mobileye", logo: "/brands/mobileye.jpg", description: "Tecnolog\u00eda avanzada de seguridad vehicular y ADAS." },
  { name: "Moura", slug: "moura", logo: "/brands/moura.png", description: "Bater\u00edas de alto rendimiento para todo tipo de veh\u00edculos." },
  { name: "TEROSON", slug: "teroson", logo: "/brands/teroson.jpg", description: "Selladores y adhesivos especializados para carrocer\u00eda." },
  { name: "Wurth", slug: "wurth", logo: "/brands/wurth.svg", description: "Herramientas y productos qu\u00edmicos profesionales." },
  { name: "Danval", slug: "danval", logo: "/brands/danval.svg", description: "Componentes el\u00e9ctricos y repuestos para transporte." },
  { name: "Optibelt", slug: "optibelt", logo: "/brands/optibelt.svg", description: "Correas de transmisi\u00f3n de alta calidad y durabilidad." },
];

export default function MarcasPage() {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Marcas" },
        ]}
        title="Nuestras Marcas"
        description="Trabajamos con las mejores marcas del mercado."
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/collections/${brand.slug}`}
              className="bg-white border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="h-20 flex items-center justify-center mb-4">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="object-contain max-h-16 w-auto"
                />
              </div>
              <h3 className="font-bold text-dark text-center mb-1 group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-dark/60 text-center leading-relaxed">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
