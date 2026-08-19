import type { Metadata } from "next";
import ResetPasswordPanel from "@/components/account/ResetPasswordPanel";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  robots: { index: false, follow: false },
};

type ResetPageSearchParams = Promise<{
  reset_url?: string | string[];
  resetUrl?: string | string[];
}>;

function getSingleValue(
  value: string | string[] | undefined
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function CuentaRestablecerPage({
  searchParams,
}: {
  searchParams: ResetPageSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const resetUrl =
    getSingleValue(resolvedSearchParams.reset_url) ??
    getSingleValue(resolvedSearchParams.resetUrl);

  return (
    <div className="min-h-screen bg-light">
      <PageHero
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Restablecer contraseña" },
        ]}
        title="Restablecer Contraseña"
        description="Ingresa una nueva contraseña desde el enlace de recuperación enviado por Shopify."
      />
      <ResetPasswordPanel resetUrl={resetUrl} />
    </div>
  );
}
