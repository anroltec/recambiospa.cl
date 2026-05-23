const DESCRIPTION_FIELDS = [
  "SKU / código",
  "SKU/código",
  "Categoría",
  "Marca",
  "Referencia",
  "Aplicación",
  "Uso recomendado",
  "Dato visible del producto",
  "Antes de comprar",
];

export function parseDescription(text: string): {
  intro: string;
  fields: Array<{ key: string; value: string }>;
} {
  const escaped = DESCRIPTION_FIELDS.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")}):\\s*`, "g");

  const matches: Array<{ key: string; index: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    matches.push({ key: m[1], index: m.index, end: m.index + m[0].length });
  }

  if (matches.length === 0) return { intro: text, fields: [] };

  const intro = text.slice(0, matches[0].index).trim();
  const fields = matches
    .map((match, i) => {
      const valueStart = match.end;
      const valueEnd = i + 1 < matches.length ? matches[i + 1].index : text.length;
      return { key: match.key, value: text.slice(valueStart, valueEnd).trim().replace(/\.$/, "") };
    })
    .filter((f) => f.key !== "SKU / código" && f.key !== "SKU/código");

  return { intro, fields };
}
