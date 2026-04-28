import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Carrito de Compras",
  robots: { index: false, follow: false },
};

export default function CarritoPage() {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Carrito" },
        ]}
        title="Carrito de Compras"
      />
      <CartPageContent />
    </div>
  );
}
