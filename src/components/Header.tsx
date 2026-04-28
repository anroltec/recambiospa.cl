"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const catalogCategories = [
  { name: "AMARRAS", href: "/collections/amarras" },
  { name: "BATERÍAS", href: "/collections/baterias" },
  { name: "CALEFACCIÓN", href: "/collections/calefaccion" },
  { name: "EXTINTORES", href: "/collections/extintores" },
  { name: "HERRAMIENTAS", href: "/collections/herramientas" },
  { name: "ILUMINACIÓN", href: "/collections/iluminacion" },
  { name: "KIT ESPECIALES", href: "/collections/kit-especiales" },
  { name: "OTROS", href: "/collections/otros" },
];

const lightVehicles = [
  { name: "Seguridad", href: "/vehiculos-livianos/seguridad" },
  { name: "Eléctrico", href: "/vehiculos-livianos/electrico" },
  { name: "Herramientas", href: "/vehiculos-livianos/herramientas" },
];

const heavyVehicles = [
  { name: "Buses y camiones", href: "/vehiculos-pesados/buses-camiones" },
  { name: "Otros", href: "/vehiculos-pesados/otros" },
];

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/collections", dropdown: "catalog" },
  { label: "Vehículos livianos", href: "/vehiculos-livianos", dropdown: "light" },
  { label: "Vehículos pesados", href: "/vehiculos-pesados", dropdown: "heavy" },
  { label: "Marcas", href: "/marcas" },
  { label: "Contacto", href: "/contacto" },
];

function getDropdownItems(key: string) {
  if (key === "catalog") return catalogCategories;
  if (key === "light") return lightVehicles;
  if (key === "heavy") return heavyVehicles;
  return [];
}

export default function Header() {
  const router = useRouter();
  const { totalQuantity } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-dark text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="https://wa.me/" className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <Phone size={12} />
              <span>+569 xxxx xxxx</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/70">
              <Truck size={12} />
              Envíos a todo Chile
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-white/70">
            Lun - Vie: 9:00 - 18:00
          </span>
        </div>
      </div>

      {/* Main header row - logo, search, cart */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Recambio SPA"
              width={240}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos, marcas, SKU..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm text-dark placeholder:text-steel focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="absolute right-0 top-0 h-full bg-primary hover:bg-primary-dark text-white px-4 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-dark"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Cerrar b\u00fasqueda" : "Abrir b\u00fasqueda"}
            >
              <Search size={22} />
            </button>
            <Link href="/cuenta" className="text-dark hover:text-primary transition-colors" aria-label="Mi cuenta">
              <User size={24} />
            </Link>
            <Link href="/carrito" className="relative text-dark hover:text-primary transition-colors" aria-label="Carrito de compras">
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-dark"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="absolute right-0 top-0 h-full bg-primary text-white px-4">
                <Search size={16} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation bar - feram style */}
      <nav className="bg-primary-dark hidden md:block">
        <div className="w-full">
          <ul className="flex items-center justify-center divide-x divide-white/20">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.dropdown)}
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </Link>
                {link.dropdown && openDropdown === link.dropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-xl min-w-[240px] py-1 z-50 border-t-2 border-primary">
                    {getDropdownItems(link.dropdown).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-dark hover:bg-light hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-xl border-t fixed inset-x-0 bottom-0 overflow-y-auto z-40" style={{ top: `${headerHeight}px` }}>
          <nav>
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="flex-1 px-5 py-3.5 text-sm font-medium text-dark"
                    onClick={() => !link.dropdown && setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <button
                      className="px-5 py-3.5 text-steel"
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === link.dropdown ? null : link.dropdown!
                        )
                      }
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileDropdown === link.dropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {link.dropdown && mobileDropdown === link.dropdown && (
                  <div className="bg-light">
                    {getDropdownItems(link.dropdown).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-8 py-2.5 text-sm text-dark/80 hover:text-primary border-b border-gray-100/50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
