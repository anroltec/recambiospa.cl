import type { Brand } from "@/types/product";

export const brandLogos: Brand[] = [
  { name: "Braslux", logo: "/brands/braslux.png", href: "/collections/braslux" },
  { name: "Henkel", logo: "/brands/henkel.png", href: "/collections/henkel" },
  { name: "Loctite", logo: "/brands/loctite.png", href: "/collections/loctite" },
  { name: "Mobileye", logo: "/brands/mobileye.jpg", href: "/collections/mobileye" },
  { name: "Moura", logo: "/brands/moura.png", href: "/collections/moura" },
  { name: "TEROSON", logo: "/brands/teroson.jpg", href: "/collections/teroson" },
  { name: "Wurth", logo: "/brands/wurth.svg", href: "/collections/wurth" },
];

export const footerBrandLinks = brandLogos.map(({ name, href }) => ({ name, href }));
