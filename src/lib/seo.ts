export const SITE_NAME = "Recambio SpA";
export const SITE_URL = "https://recambiospa.cl";

export const DEFAULT_SITE_TITLE =
  "Recambio SpA | Repuestos y Accesorios para Transporte en Chile";

export const DEFAULT_SITE_DESCRIPTION =
  "Importaci\u00f3n y distribuci\u00f3n de repuestos, accesorios e insumos para veh\u00edculos livianos y pesados, con servicio t\u00e9cnico especializado y env\u00edos a todo Chile.";

export const DEFAULT_SOCIAL_DESCRIPTION =
  "Repuestos, accesorios y servicio t\u00e9cnico para transporte. Braslux, Loctite, Teroson, Moura, Wurth y m\u00e1s, con despacho a todo Chile.";

export const SITE_KEYWORDS = [
  "repuestos para transporte",
  "repuestos para camiones",
  "repuestos para buses",
  "repuestos vehiculos livianos",
  "accesorios para transporte",
  "iluminacion led para camiones",
  "baterias moura",
  "adhesivos loctite",
  "selladores teroson",
  "herramientas wurth",
  "servicio tecnico electronico vehicular",
  "repuestos en chile",
  "Recambio SpA",
];

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function toAbsoluteAssetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function getPrimaryCatalogImage(images: string[]): string | null {
  const image = images.find(
    (candidate) =>
      candidate &&
      candidate !== "/products/placeholder.svg" &&
      !candidate.endsWith("/products/placeholder.svg")
  );

  return image ? toAbsoluteAssetUrl(image) : null;
}
