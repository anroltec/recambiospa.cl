import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      {/* Red accent stripe */}
      <div className="h-1 bg-primary" />

      <div className="bg-primary-dark text-white">
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
              <p className="text-sm text-steel leading-relaxed mb-4">
                Importaci&oacute;n y Distribuci&oacute;n de Soluciones para Transporte.
              </p>
              <div className="space-y-2 text-sm text-steel">
                <a href="https://wa.me/" className="flex items-center gap-2 hover:text-white transition-colors">
                  <PhoneCall size={14} className="text-primary" strokeWidth={1.5} />
                  +569 xxxx xxxx
                </a>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-primary" strokeWidth={1.5} />
                  ventas@recambiospa.cl
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-primary mt-0.5" strokeWidth={1.5} />
                  Santiago, Chile
                </p>
              </div>
              <a href="#" aria-label="Instagram" className="inline-flex items-center gap-2 text-sm text-steel hover:text-white transition-colors mt-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
            </div>

            {/* Cat&aacute;logo */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Cat&aacute;logo</h3>
              <ul className="space-y-2 text-sm text-steel">
                {["Amarras", "Bater\u00edas", "Calefacci\u00f3n", "Extintores", "Herramientas", "Iluminaci\u00f3n", "Kit Especiales", "Otros"].map((cat) => (
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
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Marcas</h3>
              <ul className="space-y-2 text-sm text-steel">
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
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Ayuda</h3>
              <ul className="space-y-2 text-sm text-steel mb-6">
                <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
                <li><Link href="/servicio-tecnico" className="hover:text-white transition-colors">Servicio t&eacute;cnico</Link></li>
                <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Pol&iacute;tica de Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white transition-colors">T&eacute;rminos y Condiciones</Link></li>
              </ul>

              <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-white">Suscr&iacute;bete</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 bg-white/10 border border-steel/30 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:outline-none focus:border-primary"
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
          <div className="max-w-7xl mx-auto px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-steel/60">
            <p>&copy; 2026, Recambio SpA</p>
            <p>Env&iacute;os a todo Chile</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
