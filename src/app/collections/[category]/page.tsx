import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogConnectionState from "@/components/catalog/CatalogConnectionState";
import CatalogListing from "@/components/catalog/CatalogListing";
import {
  getCatalogData,
  isCatalogConnectionError,
  resolveCatalogSlug,
} from "@/lib/catalog";
import { SITE_NAME } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

function readSearchParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function loadCategoryPageData(params: Props["params"], searchParams: Props["searchParams"]) {
  try {
    const { category } = await params;
    const query = await searchParams;
    const resolved = await resolveCatalogSlug(category);

    if (!resolved) {
      return {
        ok: true as const,
        category,
        resolved: null,
        query,
        products: [],
        categories: [],
        brands: [],
      };
    }

    const { products, categories, brands } = await getCatalogData();

    return {
      ok: true as const,
      category,
      resolved,
      query,
      products,
      categories,
      brands,
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      const { category } = await params;
      return {
        ok: false as const,
        category,
      };
    }

    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { category } = await params;
    const resolved = await resolveCatalogSlug(category);

    if (!resolved) {
      return {};
    }

    const prefix = resolved.type === "category" ? "Categoria" : "Marca";
    const canonical = `/collections/${category}`;
    const description = `${prefix}: ${resolved.label}. Repuestos y accesorios para transporte disponibles en Recambio SpA.`;

    return {
      title: `${resolved.label} | ${SITE_NAME}`,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${resolved.label} | ${SITE_NAME}`,
        description,
        url: canonical,
      },
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return {
        title: `Cat\u00e1logo temporalmente no disponible | ${SITE_NAME}`,
      };
    }

    throw error;
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const data = await loadCategoryPageData(params, searchParams);

  if (!data.ok) {
    return (
      <CatalogConnectionState
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Catalogo", href: "/collections" },
          { label: data.category },
        ]}
        retryHref={`/collections/${data.category}`}
      />
    );
  }

  if (!data.resolved) {
    notFound();
  }

  const initialSearchQuery = readSearchParam(data.query.q);
  const initialCategory = data.resolved.type === "category" ? data.resolved.value : "";
  const initialBrand = data.resolved.type === "brand" ? data.resolved.value : "";

  return (
    <CatalogListing
      key={`collection:${data.category}:${initialSearchQuery}:${initialCategory}:${initialBrand}`}
      products={data.products}
      categories={data.categories}
      brands={data.brands}
      initialCategory={initialCategory}
      initialBrand={initialBrand}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
