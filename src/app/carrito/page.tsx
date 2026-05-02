import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CartPageContent from "@/components/cart/CartPageContent";
import { getCatalogData, isCatalogConnectionError } from "@/lib/catalog";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Carrito de Compras",
  robots: { index: false, follow: false },
};

export default async function CarritoPage() {
  let products: Product[] = [];
  let catalogUnavailable = false;

  try {
    products = (await getCatalogData()).products;
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      catalogUnavailable = true;
    } else {
      throw error;
    }
  }

  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Carrito" },
        ]}
        title="Carrito de Compras"
      />
      <CartPageContent
        catalogProducts={products}
        catalogUnavailable={catalogUnavailable}
      />
    </div>
  );
}
