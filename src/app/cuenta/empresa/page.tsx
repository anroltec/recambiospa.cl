import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AccountPanel from "@/components/account/AccountPanel";

export const metadata: Metadata = {
  title: "Datos Empresa",
  robots: { index: false, follow: false },
};

export default function CuentaEmpresaPage() {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Cuenta", href: "/cuenta" },
          { label: "Datos Empresa" },
        ]}
        title="Datos Empresa"
        description="Administra RUT, razón social, giro y dirección de facturación desde tu cuenta de cliente."
      />
      <AccountPanel view="company" />
    </div>
  );
}
