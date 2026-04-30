import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogListing from "@/components/catalog/CatalogListing";
import { getCatalogData, resolveCatalogSlug } from "@/lib/catalog";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const resolved = await resolveCatalogSlug(category);

  if (!resolved) {
    notFound();
  }

  const { products, categories, brands } = await getCatalogData();

  return (
    <CatalogListing
      products={products}
      categories={categories}
      brands={brands}
      initialCategory={resolved.type === "category" ? resolved.value : ""}
      initialBrand={resolved.type === "brand" ? resolved.value : ""}
    />
  );
}
