"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone, Truck } from "lucide-react";
import { navLinks, getDropdownItems } from "@/data/navigation";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { totalQuantity } = useCart();
  const {
    mobileOpen,
    openDropdown,
    mobileDropdown,
    searchOpen,
    toggleMobile,
    toggleSearch,
    openDesktopDropdown,
    closeDesktopDropdown,
    toggleMobileDropdown,
    closeMobile,
  } = useMenu();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      router.push(`/collections?q=${encodeURIComponent(q)}`);
      setSearchValue("");
    }
  }

  return (
    <header className="sticky top-0 z-50">
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

      {/* Main header row */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Recambio SPA" width={240} height={80} className="h-16 w-auto" priority />
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar productos, marcas, SKU..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="absolute right-0 top-0 h-full bg-primary hover:bg-primary-dark text-white px-4 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <button className="md:hidden text-dark" onClick={toggleSearch}>
              <Search size={22} />
            </button>
            <Link href="/cuenta" className="text-dark hover:text-primary transition-colors">
              <User size={24} />
            </Link>
            <Link href="/carrito" className="relative text-dark hover:text-primary transition-colors">
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
            <button className="md:hidden text-dark" onClick={toggleMobile}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 top-0 h-full bg-primary text-white px-4">
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <nav className="bg-primary-dark hidden md:block">
        <div className="w-full">
          <ul className="flex items-center justify-center divide-x divide-white/20">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && openDesktopDropdown(link.dropdown)}
                onMouseLeave={() => link.dropdown && closeDesktopDropdown()}
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
        <div className="md:hidden bg-white shadow-xl border-t fixed inset-x-0 top-[105px] bottom-0 overflow-y-auto z-50">
          <nav>
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="flex-1 px-5 py-3.5 text-sm font-medium text-dark"
                    onClick={() => !link.dropdown && closeMobile()}
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <button
                      className="px-5 py-3.5 text-gray-400"
                      onClick={() => toggleMobileDropdown(link.dropdown!)}
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
                        onClick={closeMobile}
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
