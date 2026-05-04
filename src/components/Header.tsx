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
import { getDropdownItems, navLinks } from "@/data/navigation";

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
      <div className="bg-dark text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/"
              className="flex items-center gap-1.5 transition-colors hover:text-primary-light"
            >
              <Phone size={12} />
              <span>+569 xxxx xxxx</span>
            </a>
            <span className="hidden items-center gap-1.5 text-white/70 sm:flex">
              <Truck size={12} />
              Envíos a todo Chile
            </span>
          </div>
          <span className="hidden items-center gap-1.5 text-white/70 sm:flex">
            Lun - Vie: 9:00 - 18:00
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
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

          <form onSubmit={handleSearch} className="hidden max-w-2xl flex-1 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos, marcas, SKU..."
                className="w-full rounded-sm border border-gray-300 px-4 py-2.5 text-sm text-dark placeholder:text-steel focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full bg-primary px-4 text-white transition-colors hover:bg-primary-dark"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <button
              className="text-dark md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
              <Search size={22} />
            </button>
            <Link
              href="/cuenta"
              className="text-dark transition-colors hover:text-primary"
              aria-label="Mi cuenta"
            >
              <User size={24} />
            </Link>
            <Link
              href="/carrito"
              className="relative text-dark transition-colors hover:text-primary"
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
            <button
              className="text-dark md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full bg-primary px-4 text-white"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
        )}
      </div>

      <nav className="hidden bg-primary-dark md:block">
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
                  className="flex items-center gap-1.5 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </Link>
                {link.dropdown && openDropdown === link.dropdown && (
                  <div className="absolute left-0 top-full z-50 min-w-[240px] border-t-2 border-primary bg-white py-1 shadow-xl">
                    {getDropdownItems(link.dropdown).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-dark transition-colors hover:bg-light hover:text-primary"
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

      {mobileOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t bg-white shadow-xl md:hidden"
          style={{ top: `${headerHeight}px` }}
        >
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
                          mobileDropdown === link.dropdown ? null : (link.dropdown ?? null),
                        )
                      }
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          mobileDropdown === link.dropdown ? "rotate-180" : ""
                        }`}
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
                        className="block border-b border-gray-100/50 px-8 py-2.5 text-sm text-dark/80 hover:text-primary"
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
