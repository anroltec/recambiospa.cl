import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { hasShopifyStorefrontEnv } from "@/lib/env";

const SITE_URL = "https://recambiospa.cl";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Recambio SpA - Repuestos y Accesorios para Transporte | Envíos a Todo Chile",
    template: "%s | Recambio SpA",
  },
  description:
    "Importación y distribución de repuestos, accesorios e insumos para vehículos livianos y pesados. Marcas líderes: Braslux, Loctite, Teroson, Moura, Wurth. Envíos a todo Chile.",
  keywords: [
    "repuestos vehículos",
    "accesorios transporte",
    "repuestos camiones",
    "iluminación LED camiones",
    "baterías Moura",
    "adhesivos Loctite",
    "selladores Teroson",
    "herramientas Wurth",
    "repuestos buses",
    "envíos Chile",
    "Recambio SpA",
  ],
  authors: [{ name: "Recambio SpA" }],
  creator: "Recambio SpA",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "Recambio SpA",
    title: "Recambio SpA - Repuestos y Accesorios para Transporte",
    description:
      "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados. Envíos a todo Chile.",
    images: [
      {
        url: "/logo.svg",
        width: 240,
        height: 80,
        alt: "Recambio SpA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recambio SpA - Repuestos y Accesorios para Transporte",
    description:
      "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados. Envíos a todo Chile.",
    images: ["/logo.svg"],
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
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shopifyEnabled = hasShopifyStorefrontEnv();

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Recambio SpA",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
              description:
                "Importación y distribución de repuestos y accesorios para vehículos livianos y pesados.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Santiago",
                addressCountry: "CL",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "ventas@recambiospa.cl",
                contactType: "sales",
                availableLanguage: "Spanish",
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
