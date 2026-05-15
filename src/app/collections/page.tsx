import type { Metadata } from "next";
import CatalogConnectionState from "@/components/catalog/CatalogConnectionState";
import CatalogListing from "@/components/catalog/CatalogListing";
import { getCatalogData, isCatalogConnectionError } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Cat\u00e1logo de productos | ${SITE_NAME}`,
  description:
    "Explora el cat\u00e1logo de repuestos, accesorios e insumos para veh\u00edculos livianos y pesados de Recambio SpA.",
  alternates: { canonical: "/collections" },
};

interface Props {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    brand?: string | string[];
  }>;
}

function readSearchParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function loadCollectionsPageData(searchParams: Props["searchParams"]) {
  try {
    const { products, categories, brands } = await getCatalogData();
    const query = await searchParams;

    return {
      ok: true as const,
      products,
      categories,
      brands,
      query,
    };
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return { ok: false as const };
    }

    throw error;
  }
}

export default async function CollectionsPage({ searchParams }: Props) {
  const data = await loadCollectionsPageData(searchParams);

  if (!data.ok) {
    return (
      <CatalogConnectionState
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Catalogo" },
        ]}
        retryHref="/collections"
      />
    );
  }

  const initialSearchQuery = readSearchParam(data.query.q);
  const initialCategory = readSearchParam(data.query.category);
  const initialBrand = readSearchParam(data.query.brand);

  return (
    <CatalogListing
      key={`collections:${initialSearchQuery}:${initialCategory}:${initialBrand}`}
      products={data.products}
      categories={data.categories}
      brands={data.brands}
      initialSearchQuery={initialSearchQuery}
      initialCategory={initialCategory}
      initialBrand={initialBrand}
    />
  );
}
