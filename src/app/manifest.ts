import type { MetadataRoute } from "next";
import { DEFAULT_SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Repuestos y Accesorios para Transporte`,
    short_name: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#D4002A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
