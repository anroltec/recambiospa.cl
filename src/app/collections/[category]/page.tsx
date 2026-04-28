import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, brands } from "@/data/products";
import { brandLogos } from "@/data/brands";
import CatalogView from "@/components/catalog/CatalogView";

interface Props {
  params: Promise<{ category: string }>;
}

function resolveSlug(slug: string): { type: "category" | "brand"; label: string; value: string } | null {
  // Check categories
  const cat = categories.find((c) => c.id === slug);
  if (cat) return { type: "category", label: cat.name, value: cat.id };

  // Check brands (from brandLogos slugs and products brands array)
  const brandLogo = brandLogos.find((b) => b.href === `/collections/${slug}`);
  if (brandLogo) {
    const match = brands.find((b) => b.toLowerCase() === brandLogo.name.toLowerCase());
    return { type: "brand", label: brandLogo.name, value: match ?? brandLogo.name };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const resolved = resolveSlug(category);
  if (!resolved) return {};
  const prefix = resolved.type === "category" ? "Categoría" : "Marca";
  return {
    title: `${resolved.label} | Recambio SPA`,
    description: `${prefix}: ${resolved.label} — repuestos y accesorios para transporte.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const resolved = resolveSlug(category);

  if (!resolved) notFound();

  return (
    <Suspense>
      {resolved.type === "category" ? (
        <CatalogView
          initialCategory={resolved.value}
          title={resolved.label}
          breadcrumb={{ label: resolved.label }}
        />
      ) : (
        <CatalogView
          initialBrand={resolved.value}
          title={`Marca: ${resolved.label}`}
          breadcrumb={{ label: resolved.label }}
        />
      )}
    </Suspense>
  );
}
