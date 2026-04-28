import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, User, Lock, ShoppingBag } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mi Cuenta | Recambio SPA",
  description: "Accede a tu cuenta para ver tus pedidos y gestionar tu perfil.",
};

export default function CuentaPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Mi Cuenta</span>
          </nav>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-dark text-center uppercase tracking-wide mb-2">
            Portal de Clientes
          </h1>
          <p className="text-center text-gray-500 text-sm mb-10">
            Pronto podrás iniciar sesión para ver tus pedidos, historial de compras y gestionar tu perfil.
          </p>

          {/* Próximamente features */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-dark text-sm uppercase tracking-wide mb-4">
              Próximamente disponible:
            </h2>
            <ul className="space-y-3">
              {[
                { icon: User, text: "Registro e inicio de sesión" },
                { icon: ShoppingBag, text: "Historial de pedidos" },
                { icon: Lock, text: "Datos de facturación y despacho" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={15} className="text-primary flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              ¿Necesitas ayuda con un pedido?
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 text-sm uppercase tracking-wider transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
