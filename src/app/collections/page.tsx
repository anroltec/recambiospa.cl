import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogListing from "@/components/catalog/CatalogListing";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Recambio SPA",
  description: "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados.",
};

export default function CollectionsPage() {
  return (
    <Suspense>
      <CatalogListing />
    </Suspense>
  );
}
