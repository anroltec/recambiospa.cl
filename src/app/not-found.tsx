import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-light min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-dark mb-3">P&aacute;gina no encontrada</h1>
        <p className="text-dark/60 text-sm mb-8 leading-relaxed">
          La p&aacute;gina que buscas no existe o fue movida. Prueba navegar desde el inicio
          o buscar en nuestro cat&aacute;logo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Ir al inicio
          </Link>
          <Link
            href="/collections"
            className="bg-white border border-gray-200 hover:border-primary text-dark font-semibold px-6 py-3 text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} />
            Ver cat&aacute;logo
          </Link>
        </div>
      </div>
    </div>
  );
}
