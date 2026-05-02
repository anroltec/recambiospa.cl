import type { Metadata } from "next";
import CatalogListing from "@/components/catalog/CatalogListing";
import { getCatalogData } from "@/lib/catalog";

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

export default async function CollectionsPage({ searchParams }: Props) {
  const { products, categories, brands } = await getCatalogData();
  const query = await searchParams;

  return (
    <CatalogListing
      products={products}
      categories={categories}
      brands={brands}
      initialSearchQuery={readSearchParam(query.q)}
      initialCategory={readSearchParam(query.category)}
      initialBrand={readSearchParam(query.brand)}
    />
  );
}
