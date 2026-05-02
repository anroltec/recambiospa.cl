import type { Metadata } from "next";
import CatalogConnectionState from "@/components/catalog/CatalogConnectionState";
import CatalogListing from "@/components/catalog/CatalogListing";
import { getCatalogData, isCatalogConnectionError } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalogo de Productos | Recambio SPA",
  description:
    "Importacion y distribucion de repuestos y accesorios para vehiculos livianos y pesados.",
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

  return (
    <CatalogListing
      products={data.products}
      categories={data.categories}
      brands={data.brands}
      initialSearchQuery={readSearchParam(data.query.q)}
      initialCategory={readSearchParam(data.query.category)}
      initialBrand={readSearchParam(data.query.brand)}
    />
  );
}
