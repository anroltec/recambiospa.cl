import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrackingScripts from "@/components/analytics/TrackingScripts";
import { CartProvider } from "@/context/CartContext";
import { hasShopifyStorefrontEnv } from "@/lib/env";
import { WHATSAPP_DISPLAY_NUMBER } from "@/lib/contact";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  DEFAULT_SOCIAL_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SOCIAL_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SOCIAL_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shopifyEnabled = hasShopifyStorefrontEnv();

  return (
    <html lang="es-CL">
      <body className="min-h-screen flex flex-col">
        <TrackingScripts />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: SITE_URL,
              logo: absoluteUrl("/logo.svg"),
              description: DEFAULT_SITE_DESCRIPTION,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Santiago",
                addressCountry: "CL",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: WHATSAPP_DISPLAY_NUMBER,
                email: "ventas@recambiospa.cl",
                contactType: "sales",
                areaServed: "CL",
                availableLanguage: ["es-CL", "es"],
              },
            }),
          }}
        />
        <a href="#main-content" className="sr-only focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:z-[100] focus:fixed focus:top-0 focus:left-0">
          Saltar al contenido principal
        </a>
        <CartProvider shopifyEnabled={shopifyEnabled}>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
