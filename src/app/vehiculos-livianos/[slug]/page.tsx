import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// Sub-rutas como /vehiculos-livianos/seguridad redirigen al catálogo filtrado
export default async function VehiculosLivianosSlugPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/collections/${slug}`);
}
