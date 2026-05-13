"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ChevronDown,
  KeyRound,
  LogOut,
  Loader2,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getDropdownItems, navLinks } from "@/data/navigation";
import LoginModal from "@/components/account/LoginModal";
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_URL } from "@/lib/contact";

type AuthStatus = "loading" | "guest" | "authed";

interface AccountProfile {
  email: string;
  firstName: string | null;
  lastName: string | null;
}

function getInitials(profile: AccountProfile): string {
  const f = profile.firstName?.[0]?.toUpperCase() ?? "";
  const l = profile.lastName?.[0]?.toUpperCase() ?? "";
  return f || l ? `${f}${l}` : (profile.email[0]?.toUpperCase() ?? "U");
}

const ACCOUNT_LINKS = [
  { href: "/cuenta",         label: "Resumen",       icon: ShieldCheck },
  { href: "/cuenta/empresa", label: "Datos Empresa",  icon: Building2   },
  { href: "/cuenta/seguridad", label: "Seguridad",   icon: KeyRound     },
  { href: "/cuenta/pedidos", label: "Pedidos",        icon: ShoppingBag },
];

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  const headerRef       = useRef<HTMLElement>(null);
  const accountBtnRef   = useRef<HTMLDivElement>(null);

  const [headerHeight,       setHeaderHeight]       = useState(0);
  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [openDropdown,       setOpenDropdown]       = useState<string | null>(null);
  const [mobileDropdown,     setMobileDropdown]     = useState<string | null>(null);
  const [searchOpen,         setSearchOpen]         = useState(false);
  const [searchQuery,        setSearchQuery]        = useState("");
  const [loginModalOpen,     setLoginModalOpen]     = useState(false);
  const [accountDropdown,    setAccountDropdown]    = useState(false);
  const [isLoggingOut,       setIsLoggingOut]       = useState(false);
  const [authStatus,         setAuthStatus]         = useState<AuthStatus>("loading");
  const [accountProfile,     setAccountProfile]     = useState<AccountProfile | null>(null);

  /* ── Check auth on mount ── */
  useEffect(() => {
    fetch("/api/customer/profile", { method: "GET", cache: "no-store" })
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as { ok: boolean; profile: AccountProfile };
          setAccountProfile(data.profile);
          setAuthStatus("authed");
        } else {
          setAuthStatus("guest");
        }
      })
      .catch(() => setAuthStatus("guest"));
  }, [pathname]); // re-check on route change (after login redirect)

  /* ── Close account dropdown when clicking outside ── */
  useEffect(() => {
    if (!accountDropdown) return;
    function handleClick(e: MouseEvent) {
      if (accountBtnRef.current && !accountBtnRef.current.contains(e.target as Node)) {
        setAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountDropdown]);

  /* ── Header height for mobile menu ── */
  useEffect(() => {
    const update = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/customer/auth/logout", { method: "POST" });
    } finally {
      setAccountProfile(null);
      setAuthStatus("guest");
      setAccountDropdown(false);
      setIsLoggingOut(false);
      router.push("/");
    }
  }, [router]);

  /* ── Account button ── */
  const accountButton = (() => {
    if (authStatus === "loading") {
      return (
        <div className="flex h-8 w-8 items-center justify-center">
          <Loader2 size={18} className="animate-spin text-dark/30" />
        </div>
      );
    }

    if (authStatus === "guest") {
      return (
        <button
          onClick={() => setLoginModalOpen(true)}
          className="text-dark transition-colors hover:text-primary"
          aria-label="Iniciar sesión"
        >
          <User size={24} />
        </button>
      );
    }

    /* Authenticated */
    return (
      <div ref={accountBtnRef} className="relative">
        <button
          onClick={() => setAccountDropdown((v) => !v)}
          aria-label="Mi cuenta"
          aria-expanded={accountDropdown}
          className="flex items-center gap-2 group"
        >
          {/* Avatar circle */}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-black text-white ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
            {accountProfile ? getInitials(accountProfile) : "?"}
          </span>
          <ChevronDown
            size={14}
            className={`hidden text-dark/50 transition-transform duration-200 md:block ${accountDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {accountDropdown && (
          <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 border border-gray-100 bg-white shadow-xl">
            {/* Decorative top line */}
            <div className="h-0.5 w-full bg-primary" />

            {/* User info */}
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-xs font-bold text-dark">
                {accountProfile?.firstName
                  ? `${accountProfile.firstName} ${accountProfile.lastName ?? ""}`.trim()
                  : accountProfile?.email}
              </p>
              {accountProfile?.firstName && (
                <p className="truncate text-[11px] text-dark/40">{accountProfile.email}</p>
              )}
            </div>

            {/* Nav links */}
            <nav className="py-1">
              {ACCOUNT_LINKS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAccountDropdown(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/5 text-primary"
                        : "text-dark/70 hover:bg-light hover:text-primary"
                    }`}
                  >
                    <item.icon size={15} className={active ? "text-primary" : "text-dark/40"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isLoggingOut
                  ? <Loader2 size={15} className="animate-spin" />
                  : <LogOut size={15} />
                }
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    );
  })();

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-dark text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-5">
            <a
              href={WHATSAPP_URL}
              className="flex items-center gap-1.5 transition-colors hover:text-primary-light"
            >
              <Phone size={12} />
              <span>{WHATSAPP_DISPLAY_NUMBER}</span>
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

      {/* Main header */}
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

            {accountButton}

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

      {/* Nav bar */}
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

      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}

      {/* Mobile menu */}
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

            {/* Mobile account section */}
            <div className="border-b border-gray-100">
              {authStatus === "authed" && accountProfile ? (
                <>
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-black text-white">
                      {getInitials(accountProfile)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-dark">
                        {accountProfile.firstName ?? accountProfile.email}
                      </p>
                      <p className="text-xs text-dark/40">{accountProfile.email}</p>
                    </div>
                  </div>
                  {ACCOUNT_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 border-t border-gray-50 px-8 py-2.5 text-sm text-dark/70 hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setMobileOpen(false); void handleLogout(); }}
                    className="flex w-full items-center gap-3 border-t border-gray-50 px-8 py-2.5 text-sm text-red-500"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setLoginModalOpen(true); }}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-dark"
                >
                  <User size={16} />
                  Iniciar sesión
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
