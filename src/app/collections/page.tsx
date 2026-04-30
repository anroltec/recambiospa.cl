import type { Metadata } from "next";
import CatalogListing from "@/components/catalog/CatalogListing";
import { getCatalogData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalogo de Productos | Recambio SPA",
  description:
    "Importacion y distribucion de repuestos y accesorios para vehiculos livianos y pesados.",
};

export default async function CollectionsPage() {
  const { products, categories, brands } = await getCatalogData();

  return <CatalogListing products={products} categories={categories} brands={brands} />;
}
