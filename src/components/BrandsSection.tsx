import Link from "next/link";
import Image from "next/image";

const brands = [
  { name: "Braslux", href: "/collections/braslux", logo: "/brands/braslux.png" },
  { name: "Henkel", href: "/collections/henkel", logo: "/brands/henkel.png" },
  { name: "Loctite", href: "/collections/loctite", logo: "/brands/loctite.png" },
  { name: "Mobileye", href: "/collections/mobileye", logo: "/brands/mobileye.jpg" },
  { name: "Moura", href: "/collections/moura", logo: "/brands/moura.png" },
  { name: "TEROSON", href: "/collections/teroson", logo: "/brands/teroson.jpg" },
  { name: "Wurth", href: "/collections/wurth", logo: "/brands/wurth.svg" },
];

export default function BrandsSection() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide">
            Nuestras Marcas
          </h2>
          <Link
            href="/marcas"
            className="text-primary hover:text-primary-dark text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="p-6 flex items-center justify-center transition-all aspect-[4/3] hover:opacity-80"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={160}
                height={80}
                className="object-contain max-h-14 w-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
