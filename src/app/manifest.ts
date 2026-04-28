import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recambio SpA - Repuestos y Accesorios para Transporte",
    short_name: "Recambio SpA",
    description:
      "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados. Envíos a todo Chile.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#D4002A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
