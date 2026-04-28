import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { products, categories, formatPrice } from "@/data/products";
import ProductDetail from "./ProductDetail";

const SITE_URL = "https://recambiospa.cl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = products.find((p) => p.code === sku);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const title = `${product.name} - ${product.brand}`;
  const description = product.description.slice(0, 160);
  const url = `${SITE_URL}/producto/${product.code}`;

  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.code}` },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: product.images.map((img) => ({
        url: img,
        alt: product.name,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = products.find((p) => p.code === sku);

  if (!product) {
    notFound();
  }

  const categoryInfo = categories.find((c) => c.id === product.category);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.code,
    image: product.images.map((img) => `${SITE_URL}${img}`),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "CLP",
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            seller: {
              "@type": "Organization",
              name: "Recambio SpA",
            },
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${SITE_URL}/collections`,
      },
      ...(categoryInfo
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categoryInfo.name,
              item: `${SITE_URL}/collections?category=${product.category}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: `${SITE_URL}/producto/${product.code}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${SITE_URL}/producto/${product.code}`,
            },
          ]),
    ],
  };

  return (
    <div className="bg-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-white/60 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link href="/collections" className="hover:text-white transition-colors">Cat&aacute;logo</Link>
            {categoryInfo && (
              <>
                <ChevronRight size={14} />
                <Link
                  href={`/collections?category=${product.category}`}
                  className="hover:text-white transition-colors"
                >
                  {categoryInfo.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-white truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <ProductDetail product={product} />
    </div>
  );
}
