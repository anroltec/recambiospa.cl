import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AccountPanel from "@/components/account/AccountPanel";

export const metadata: Metadata = {
  title: "Mis Pedidos",
  robots: { index: false, follow: false },
};

export default function CuentaPedidosPage() {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Cuenta", href: "/cuenta" },
          { label: "Pedidos" },
        ]}
        title="Historial de Compras"
        description="Consulta el historial de pedidos del cliente autenticado directamente desde Shopify."
      />
      <AccountPanel view="orders" />
    </div>
  );
}
