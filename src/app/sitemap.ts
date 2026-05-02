import type { MetadataRoute } from "next";
import { getCatalogData, isCatalogConnectionError } from "@/lib/catalog";
import { brandDirectory, categoryDirectory, slugify } from "@/lib/catalog-taxonomy";

const SITE_URL = "https://recambiospa.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/marcas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/politica-privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categoryDirectory.map((category) => ({
    url: `${SITE_URL}/collections/${category.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  try {
    const { products, brands } = await getCatalogData();

    const brandPages: MetadataRoute.Sitemap = [...new Set([...brandDirectory, ...brands])].map(
      (brand) => ({
        url: `${SITE_URL}/collections/${slugify(brand)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/producto/${product.code}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...brandPages, ...productPages];
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return [...staticPages, ...categoryPages];
    }

    throw error;
  }
}
