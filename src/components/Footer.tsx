import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.svg"
                alt="Recambio SPA"
                width={180}
                height={60}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Importación y Distribución de Soluciones para Transporte.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/56964849088" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} className="text-primary-light" />
                +56 9 6484 9088
              </a>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-primary-light" />
                ventas@recambiospa.cl
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-primary-light mt-0.5" />
                Santiago, Chile
              </p>
            </div>
          </div>

          {/* Catálogo */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Catálogo</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Amarras", "Baterías", "Calefacción", "Extintores", "Herramientas", "Iluminación", "Kit Especiales", "Otros"].map((cat) => (
                <li key={cat}>
                  <Link href={`/collections/${cat.toLowerCase()}`} className="hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marcas */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Marcas</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Braslux", "Henkel", "Loctite", "Mobileye", "Moura", "TEROSON", "Wurth"].map((brand) => (
                <li key={brand}>
                  <Link href={`/collections/${brand.toLowerCase()}`} className="hover:text-white transition-colors">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda & Newsletter */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-gray-400 mb-6">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>

            <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Suscríbete</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary hover:bg-primary-light text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026, Recambio spa</p>
          <p>Envíos a todo Chile</p>
        </div>
      </div>
    </footer>
  );
}
