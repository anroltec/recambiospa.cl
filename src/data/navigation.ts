import type { NavLink, DropdownItem } from "@/types/navigation";

export const catalogCategories: DropdownItem[] = [
  { name: "AMARRAS", href: "/collections/amarras" },
  { name: "BATER\u00cdAS", href: "/collections/baterias" },
  { name: "CALEFACCI\u00d3N", href: "/collections/calefaccion" },
  { name: "EXTINTORES", href: "/collections/extintores" },
  { name: "HERRAMIENTAS", href: "/collections/herramientas" },
  { name: "ILUMINACI\u00d3N", href: "/collections/iluminacion" },
  { name: "KIT ESPECIALES", href: "/collections/kit-especiales" },
  { name: "OTROS", href: "/collections/otros" },
];

export const lightVehicles: DropdownItem[] = [
  { name: "Seguridad", href: "/vehiculos-livianos/seguridad" },
  { name: "El\u00e9ctrico", href: "/vehiculos-livianos/electrico" },
  { name: "Herramientas", href: "/vehiculos-livianos/herramientas" },
];

export const heavyVehicles: DropdownItem[] = [
  { name: "Buses y camiones", href: "/vehiculos-pesados/buses-camiones" },
  { name: "Otros", href: "/vehiculos-pesados/otros" },
];

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Cat\u00e1logo", href: "/collections", dropdown: "catalog" },
  { label: "Marcas", href: "/marcas" },
  { label: "Servicio t\u00e9cnico", href: "/servicio-tecnico" },
  { label: "Contacto", href: "/contacto" },
];

export const footerHelpLinks = [
  { name: "Nosotros", href: "/nosotros" },
  { name: "Servicio t\u00e9cnico", href: "/servicio-tecnico" },
  { name: "Contacto", href: "/contacto" },
  { name: "Pol\u00edtica de Privacidad", href: "/politica-privacidad" },
  { name: "T\u00e9rminos y Condiciones", href: "/terminos" },
];

export function getDropdownItems(key: string): DropdownItem[] {
  if (key === "catalog") return catalogCategories;
  if (key === "light") return lightVehicles;
  if (key === "heavy") return heavyVehicles;
  return [];
}
