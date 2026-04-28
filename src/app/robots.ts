import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cuenta", "/carrito"],
      },
    ],
    sitemap: "https://recambiospa.cl/sitemap.xml",
  };
}
