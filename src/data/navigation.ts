import type { NavLink, DropdownItem } from "@/types/navigation";

export const catalogCategories: DropdownItem[] = [
  { name: "AMARRAS", href: "/collections/amarras" },
  { name: "BATERÍAS", href: "/collections/baterias" },
  { name: "CALEFACCIÓN", href: "/collections/calefaccion" },
  { name: "EXTINTORES", href: "/collections/extintores" },
  { name: "HERRAMIENTAS", href: "/collections/herramientas" },
  { name: "ILUMINACIÓN", href: "/collections/iluminacion" },
  { name: "KIT ESPECIALES", href: "/collections/kit-especiales" },
  { name: "OTROS", href: "/collections/otros" },
];

export const lightVehicles: DropdownItem[] = [
  { name: "Seguridad", href: "/vehiculos-livianos/seguridad" },
  { name: "Eléctrico", href: "/vehiculos-livianos/electrico" },
  { name: "Herramientas", href: "/vehiculos-livianos/herramientas" },
];

export const heavyVehicles: DropdownItem[] = [
  { name: "Buses y camiones", href: "/vehiculos-pesados/buses-camiones" },
  { name: "Otros", href: "/vehiculos-pesados/otros" },
];

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/collections", dropdown: "catalog" },
  { label: "Vehículos livianos", href: "/vehiculos-livianos", dropdown: "light" },
  { label: "Vehículos pesados", href: "/vehiculos-pesados", dropdown: "heavy" },
  { label: "Marcas", href: "/marcas" },
  { label: "Contacto", href: "/contacto" },
];

export const footerHelpLinks = [
  { name: "Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contacto" },
  { name: "Política de Privacidad", href: "/politica-privacidad" },
  { name: "Términos y Condiciones", href: "/terminos" },
];

export function getDropdownItems(key: string): DropdownItem[] {
  if (key === "catalog") return catalogCategories;
  if (key === "light") return lightVehicles;
  if (key === "heavy") return heavyVehicles;
  return [];
}
