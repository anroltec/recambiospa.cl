import type { NextConfig } from "next";

const projectRoot = process.cwd();
const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN;

const remoteImagePatterns = [
  {
    protocol: "https" as const,
    hostname: "cdn.shopify.com",
  },
];

if (shopifyStoreDomain) {
  remoteImagePatterns.push({
    protocol: "https" as const,
    hostname: shopifyStoreDomain,
  });
}

const nextConfig: NextConfig = {
  compress: true,
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    preloadEntriesOnStart: false,
    webpackMemoryOptimizations: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: remoteImagePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)", 
        headers: [ 
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|svg|webp|avif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
