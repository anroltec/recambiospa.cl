import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

const FEATURED_SKUS = [
  "04-01-06-014-1105",
  "99-01-06-014-77",
  "99-01-06-014-78",
  "04-01-02-014-71",
  "00-05-51-056-482",
  "00-05-51-056-466",
  "00-05-51-056-467",
  "00-05-51-056-471",
  "00-05-51-056-475",
  "04-01-02-014-585",
  "04-01-02-014-69",
  "99-01-06-014-76",
  "00-05-51-056-465",
  "00-01-51-056-625",
  "99-01-02-014-73",
  "00-70-19-000-477",
];

const featuredProducts = products.filter((p) => FEATURED_SKUS.includes(p.code));

export default function FeaturedProducts() {
  return (
    <section className="py-14 bg-light">
      <Container>
        <SectionHeader title="Productos Más Vendidos" linkHref="/collections" linkLabel="Ver todo" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
