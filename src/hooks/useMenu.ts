"use client";

import { useState } from "react";

export function useMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleMobile() {
    setMobileOpen((v) => !v);
  }

  function toggleSearch() {
    setSearchOpen((v) => !v);
  }

  function openDesktopDropdown(key: string) {
    setOpenDropdown(key);
  }

  function closeDesktopDropdown() {
    setOpenDropdown(null);
  }

  function toggleMobileDropdown(key: string) {
    setMobileDropdown((prev) => (prev === key ? null : key));
  }

  function closeMobile() {
    setMobileOpen(false);
    setMobileDropdown(null);
  }

  return {
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
  };
}
