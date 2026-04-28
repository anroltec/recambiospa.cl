import Link from "next/link";
import Image from "next/image";
import { brandLogos } from "@/data/brands";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export default function BrandsSection() {
  return (
    <section className="py-14 bg-white">
      <Container>
        <SectionHeader title="Nuestras Marcas" linkHref="/marcas" linkLabel="Ver todas" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brandLogos.map((brand) => (
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
      </Container>
    </section>
  );
}
