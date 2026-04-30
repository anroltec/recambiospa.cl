import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CartPageContent from "@/components/cart/CartPageContent";
import { getCatalogData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Carrito de Compras",
  robots: { index: false, follow: false },
};

export default async function CarritoPage() {
  const { products } = await getCatalogData();

  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Carrito" },
        ]}
        title="Carrito de Compras"
      />
      <CartPageContent catalogProducts={products} />
    </div>
  );
}
