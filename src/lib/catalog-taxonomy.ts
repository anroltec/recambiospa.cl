import type { Category } from "@/types/product";

export const categoryDirectory: Category[] = [
  { id: "iluminacion", name: "Iluminaci\u00f3n", color: "#F5A623" },
  { id: "generales", name: "Generales", color: "#4ABFBF" },
  { id: "baterias", name: "Bater\u00edas", color: "#7ED321" },
  { id: "kit-especiales", name: "Kit Especiales", color: "#D0021B" },
  { id: "amarras", name: "Amarras", color: "#9B59B6" },
  { id: "herramientas", name: "Herramientas", color: "#3498DB" },
  { id: "extintores", name: "Extintores", color: "#E74C3C" },
  { id: "calefaccion", name: "Calefacci\u00f3n", color: "#2ECC71" },
  { id: "electrico", name: "El\u00e9ctrico", color: "#F39C12" },
  { id: "seguridad", name: "Seguridad", color: "#1ABC9C" },
  { id: "adhesivos", name: "Adhesivos y Selladores", color: "#8E44AD" },
  { id: "otros", name: "Otros", color: "#95A5A6" },
];

export const brandDirectory = [
  "Braslux",
  "Henkel",
  "Loctite",
  "Mobileye",
  "Moura",
  "TEROSON",
  "Wurth",
  "Danval",
  "Optibelt",
  "3-RHO",
  "Recambio SpA",
];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategoryName(categoryId: string): string {
  return categoryDirectory.find((category) => category.id === categoryId)?.name ?? "Generales";
}

export function getBrandLabelFromSlug(
  slug: string,
  availableBrands: string[] = []
): string | null {
  const brands = [...new Set([...brandDirectory, ...availableBrands])];
  return brands.find((brand) => slugify(brand) === slug) ?? null;
}

export function detectBrand(name: string, vendor?: string): string {
  const source = `${vendor ?? ""} ${name}`.toUpperCase();

  if (source.includes("TEROSON")) return "TEROSON";
  if (source.includes("LOCTITE")) return "Loctite";
  if (source.includes("BRASLUX")) return "Braslux";
  if (source.includes("MOBILEYE")) return "Mobileye";
  if (source.includes("WURTH")) return "Wurth";
  if (source.includes("DANVAL")) return "Danval";
  if (source.includes("3-RHO")) return "3-RHO";
  if (source.includes("MOURA")) return "Moura";
  if (source.includes("OPTIBELT")) return "Optibelt";
  if (source.includes("HENKEL")) return "Henkel";

  return vendor?.trim() || "Recambio SpA";
}

export function detectCategory(
  code: string,
  name: string,
  productType = "",
  tags: string[] = []
): string {
  const source = [code, name, productType, ...tags].join(" ").toUpperCase();

  if (
    source.includes("FOCO LED") ||
    source.includes("FARO") ||
    source.includes("LANTERNA") ||
    source.includes("LINTERNA") ||
    source.includes("LUZ") ||
    source.includes("MICA")
  ) {
    return "iluminacion";
  }

  if (source.includes("BATERIA")) return "baterias";
  if (source.includes("EXTINTOR")) return "extintores";
  if (source.includes("CALEFAC")) return "calefaccion";
  if (source.includes("AMARRA")) return "amarras";
  if (source.includes("KIT")) return "kit-especiales";

  if (
    source.includes("HERRAMIENTA") ||
    source.includes("BROCA") ||
    source.includes("CARRO TALLER") ||
    source.includes("DISCO DE CORTE")
  ) {
    return "herramientas";
  }

  if (
    source.includes("SELLADOR") ||
    source.includes("SILICONA") ||
    source.includes("ADHESIVO") ||
    source.includes("TRABADOR") ||
    source.includes("FORMADOR") ||
    source.includes("REMOVEDOR") ||
    source.includes("PEGAMENTO") ||
    source.includes("SELLANTE")
  ) {
    return "adhesivos";
  }

  if (
    source.includes("SENSOR") ||
    source.includes("SWITCH") ||
    source.includes("RELE") ||
    source.includes("RELAY") ||
    source.includes("FUSIBLE") ||
    source.includes("VALVULA ELECTRO")
  ) {
    return "electrico";
  }

  if (source.includes("GUANTE") || source.includes("SEGURIDAD")) return "seguridad";

  if (
    source.includes("LUBRICANTE") ||
    source.includes("AFLOJADOR") ||
    source.includes("LIMPIA CONTACTO") ||
    source.includes("GRASA") ||
    source.includes("ANTIADHERENTE") ||
    source.includes("CORREA")
  ) {
    return "otros";
  }

  return "generales";
}
