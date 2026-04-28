import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Catálogo de Productos | Recambio SPA",
  description: "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados.",
};

export default function CollectionsPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
