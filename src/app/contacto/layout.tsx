import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Recambio SPA",
  description: "Contáctanos para cotizaciones, consultas técnicas y envíos a todo Chile.",
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
