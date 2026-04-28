import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductDetail from "@/components/product/ProductDetail";
import ProductGrid from "@/components/product/ProductGrid";
import Container from "@/components/ui/Container";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const product = products.find((p) => p.code === code);
  if (!product) return {};
  return {
    title: `${product.name} | Recambio SPA`,
    description: product.description || `${product.name} — SKU ${product.code}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { code } = await params;
  const product = products.find((p) => p.code === code);

  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.code !== product.code)
    .slice(0, 4);

  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight size={12} />
            <Link href="/collections" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
            {category && (
              <>
                <ChevronRight size={12} />
                <Link
                  href={`/collections/${category.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-dark font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </Container>
      </div>

      {/* Product detail */}
      <ProductDetail product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-12 border-t border-gray-200">
          <Container>
            <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
              Productos Relacionados
            </h2>
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </div>
  );
}
