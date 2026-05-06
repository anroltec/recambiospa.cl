import type { Metadata } from "next";
import CartPageContent from "@/components/cart/CartPageContent";
import Container from "@/components/ui/Container";
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
    <div className="min-h-screen bg-white">
      <section className="border-b border-black/8">
        <Container className="py-12 md:py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a28c74]">
              Compra y cotizacion
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#5b5147] md:text-6xl">
              Tu carrito
            </h1>
          </div>
        </Container>
      </section>
      <CartPageContent
        catalogProducts={products}
        catalogUnavailable={catalogUnavailable}
      />
    </div>
  );
}
