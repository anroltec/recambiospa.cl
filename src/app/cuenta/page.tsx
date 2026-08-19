import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AccountPanel from "@/components/account/AccountPanel";

export const metadata: Metadata = {
  title: "Mi Cuenta",
  robots: { index: false, follow: false },
};

export default function CuentaPage() {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Cuenta" },
        ]}
        title="Mi Cuenta"
        description="Accede con tu cuenta de cliente para revisar pedidos y mantener al día los datos de empresa y facturación."
      />
      <AccountPanel view="dashboard" />
    </div>
  );
}
