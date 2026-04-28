import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mi Cuenta",
  robots: { index: false, follow: false },
};
import { ChevronRight, User, ShoppingBag, Heart, Settings } from "lucide-react";

export default function CuentaPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-white">Mi Cuenta</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mi Cuenta</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 p-8 text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Inicia sesi&oacute;n</h2>
          <p className="text-dark/60 text-sm mb-6">
            Accede a tu cuenta para ver tus pedidos, cotizaciones y m&aacute;s.
          </p>
          <div className="max-w-sm mx-auto space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Contrase&ntilde;a"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 text-sm uppercase tracking-wide transition-colors">
              Iniciar sesi&oacute;n
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, title: "Mis Pedidos", desc: "Revisa el estado de tus compras" },
            { icon: Heart, title: "Favoritos", desc: "Productos que te interesan" },
            { icon: Settings, title: "Configuraci\u00f3n", desc: "Actualiza tus datos" },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 p-5 text-center">
              <item.icon size={24} className="text-primary mx-auto mb-2" />
              <h3 className="font-bold text-dark text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-dark/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
