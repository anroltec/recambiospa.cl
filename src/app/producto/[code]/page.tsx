import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ProductDetail from "@/components/product/ProductDetail";
import ProductGrid from "@/components/product/ProductGrid";
import Container from "@/components/ui/Container";
import {
  getCatalogData,
  getCatalogProductByCode,
  getRelatedCatalogProducts,
} from "@/lib/catalog";
import { getCategoryName } from "@/lib/catalog-taxonomy";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  const { products } = await getCatalogData();
  return products.map((product) => ({ code: product.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const product = await getCatalogProductByCode(code);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Recambio SPA`,
    description: product.description || `${product.name} - SKU ${product.code}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { code } = await params;
  const product = await getCatalogProductByCode(code);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedCatalogProducts(product);
  const categoryName = getCategoryName(product.category);

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight size={12} />
            <Link href="/collections" className="hover:text-primary transition-colors">
              Catalogo
            </Link>
            <ChevronRight size={12} />
            <Link
              href={`/collections/${product.category}`}
              className="hover:text-primary transition-colors"
            >
              {categoryName}
            </Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </Container>
      </div>

      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-gray-200">
          <Container>
            <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
              Productos relacionados
            </h2>
            <ProductGrid products={relatedProducts} />
          </Container>
        </section>
      )}
    </div>
  );
}
