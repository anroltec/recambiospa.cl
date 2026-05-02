import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CatalogConnectionStateProps {
  breadcrumbs: BreadcrumbItem[];
  retryHref: string;
  title?: string;
  description?: string;
}

export default function CatalogConnectionState({
  breadcrumbs,
  retryHref,
  title = "No pudimos cargar los productos",
  description = "La conexion con Shopify no esta disponible en este momento. Reintenta en unos minutos o contactanos si necesitas ayuda con una referencia.",
}: CatalogConnectionStateProps) {
  return (
    <div className="bg-light min-h-screen">
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={
          <>
            <AlertTriangle size={12} />
            Conexion no disponible
          </>
        }
        title={title}
        description={description}
      />

      <section className="py-10">
        <Container>
          <div className="bg-white border border-[#e5d3c5] shadow-[0_18px_60px_rgba(18,18,18,0.06)]">
            <div className="grid gap-6 px-6 py-8 md:grid-cols-[auto_1fr] md:px-8">
              <div className="flex h-14 w-14 items-center justify-center bg-[#f6ede7] text-primary-dark">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-dark">
                  Shopify no respondio a tiempo
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dark/65">
                  El sitio sigue operativo, pero no fue posible recuperar el catalogo remoto.
                  Puedes volver a intentar la carga o escribirnos para cotizar la pieza que
                  necesitas.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={retryHref}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 text-sm uppercase tracking-wide transition-colors"
                  >
                    <RefreshCcw size={16} />
                    Reintentar
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 bg-[#f7f3eb] hover:bg-[#efe7dc] text-dark font-bold px-5 py-3 text-sm uppercase tracking-wide transition-colors"
                  >
                    Contactar soporte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
