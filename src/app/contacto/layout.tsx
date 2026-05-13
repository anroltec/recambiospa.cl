import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Contacto | ${SITE_NAME}`,
  description: "Cont\u00e1ctanos para cotizaciones, consultas t\u00e9cnicas y env\u00edos a todo Chile.",
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
