import type { Metadata } from "next";
import ResetPasswordPanel from "@/components/account/ResetPasswordPanel";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Restablecer Contrasena",
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
          { label: "Restablecer contrasena" },
        ]}
        title="Restablecer Contrasena"
        description="Ingresa una nueva contrasena desde el enlace de recuperacion enviado por Shopify."
      />
      <ResetPasswordPanel resetUrl={resetUrl} />
    </div>
  );
}
