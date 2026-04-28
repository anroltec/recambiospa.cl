import { redirect } from "next/navigation";
import { categories } from "@/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

// Sub-rutas como /vehiculos-pesados/buses-camiones redirigen al catálogo
// Si el slug coincide con una categoría real, filtra por ella; si no, va al catálogo general
export default async function VehiculosPesadosSlugPage({ params }: Props) {
  const { slug } = await params;
  const validCategory = categories.find((c) => c.id === slug);
  redirect(validCategory ? `/collections/${slug}` : "/collections");
}
