import type { Metadata } from "next";
import ChangePasswordPanel from "@/components/account/ChangePasswordPanel";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Seguridad",
  robots: { index: false, follow: false },
};

export default function CuentaSeguridadPage() {
  return (
    <div className="min-h-screen bg-light">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Cuenta", href: "/cuenta" },
          { label: "Seguridad" },
        ]}
        title="Seguridad"
        description="Actualiza la contrasena del cliente autenticado sin salir de la sesion actual."
      />
      <ChangePasswordPanel />
    </div>
  );
}
