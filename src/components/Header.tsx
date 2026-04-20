"use client";

import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-dark text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="https://wa.me/56964849088" className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <Phone size={12} />
              <span>+56 9 6484 9088</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/70">
              <Truck size={12} />
              Envíos a todo Chile
            </span>
          </div>
          <Link href="/cuenta" className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
            <User size={12} />
            <span>Mi Cuenta</span>
          </Link>
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
              width={200}
              height={67}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos, marcas, SKU..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-0 top-0 h-full bg-primary hover:bg-primary-dark text-white px-4 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-dark"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={22} />
            </button>
            <Link href="/carrito" className="relative text-dark hover:text-primary transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            <button
              className="md:hidden text-dark"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button className="absolute right-0 top-0 h-full bg-primary text-white px-4">
                <Search size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation bar - feram style */}
      <nav className="bg-primary-dark hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.dropdown)}
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={13} />}
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
        <div className="md:hidden bg-white shadow-xl border-t fixed inset-x-0 top-[105px] bottom-0 overflow-y-auto z-50">
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
                      className="px-5 py-3.5 text-gray-400"
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
