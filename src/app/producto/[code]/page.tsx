import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import CatalogConnectionState from "@/components/catalog/CatalogConnectionState";
import ProductDetail from "@/components/product/ProductDetail";
import ProductGrid from "@/components/product/ProductGrid";
import Container from "@/components/ui/Container";
import {
  getCatalogData,
  getCatalogProductByCode,
  getRelatedCatalogProducts,
  isCatalogConnectionError,
} from "@/lib/catalog";
import { getCategoryName } from "@/lib/catalog-taxonomy";

interface Props {
  params: Promise<{ code: string }>;
}

async function loadProductPageData(params: Props["params"]) {
  try {
    const { code } = await params;
    const product = await getCatalogProductByCode(code);

    if (!product) {
      return {
        ok: true as const,
        code,
        product: null,
        relatedProducts: [],
        categoryName: null,
      };
    }

    const relatedProducts = await getRelatedCatalogProducts(product);
    const categoryName = getCategoryName(product.category);

    return {
      ok: true as const,
      code,
      product,
      relatedProducts,
      categoryName,
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      const { code } = await params;
      return {
        ok: false as const,
        code,
      };
    }

    throw error;
  }
}

export async function generateStaticParams() {
  try {
    const { products } = await getCatalogData();
    return products.map((product) => ({ code: product.code }));
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return [];
    }

    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { code } = await params;
    const product = await getCatalogProductByCode(code);

    if (!product) {
      return {};
    }

    return {
      title: `${product.name} | Recambio SPA`,
      description: product.description || `${product.name} - SKU ${product.code}`,
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return {
        title: "Producto temporalmente no disponible | Recambio SPA",
      };
    }

    throw error;
  }
}

export default async function ProductPage({ params }: Props) {
  const data = await loadProductPageData(params);

  if (!data.ok) {
    return (
      <CatalogConnectionState
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Catalogo", href: "/collections" },
          { label: data.code },
        ]}
        retryHref={`/producto/${data.code}`}
        title="No pudimos cargar este producto"
        description="La ficha del producto depende de Shopify y la conexion no esta disponible en este momento. Reintenta en unos minutos o contactanos para validar la referencia."
      />
    );
  }

  if (!data.product) {
    notFound();
  }

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
              href={`/collections/${data.product.category}`}
              className="hover:text-primary transition-colors"
            >
              {data.categoryName}
            </Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium truncate max-w-[200px]">
              {data.product.name}
            </span>
          </nav>
        </Container>
      </div>

      <ProductDetail product={data.product} />

      {data.relatedProducts.length > 0 && (
        <section className="py-12 border-t border-gray-200">
          <Container>
            <h2 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
              Productos relacionados
            </h2>
            <ProductGrid products={data.relatedProducts} />
          </Container>
        </section>
      )}
    </div>
  );
}
