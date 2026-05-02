import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogConnectionState from "@/components/catalog/CatalogConnectionState";
import CatalogListing from "@/components/catalog/CatalogListing";
import {
  getCatalogData,
  isCatalogConnectionError,
  resolveCatalogSlug,
} from "@/lib/catalog";

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

    return {
      title: `${resolved.label} | Recambio SPA`,
      description: `${prefix}: ${resolved.label} - repuestos y accesorios para transporte.`,
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return {
        title: "Catalogo temporalmente no disponible | Recambio SPA",
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

  return (
    <CatalogListing
      products={data.products}
      categories={data.categories}
      brands={data.brands}
      initialCategory={data.resolved.type === "category" ? data.resolved.value : ""}
      initialBrand={data.resolved.type === "brand" ? data.resolved.value : ""}
      initialSearchQuery={readSearchParam(data.query.q)}
    />
  );
}
