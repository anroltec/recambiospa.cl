import type { NextRequest } from "next/server";
import { getCatalogData, getProductUrl, isCatalogConnectionError } from "@/lib/catalog";
import {
  getCatalogExactProductMatch,
  getCatalogSearchSuggestions,
} from "@/lib/catalog-search";
import type { Product } from "@/types/product";

interface SearchSuggestion {
  code: string;
  name: string;
  brand: string;
  category: string;
  url: string;
}

function toSuggestion(product: Product): SearchSuggestion {
  return {
    code: product.code,
    name: product.name,
    brand: product.brand,
    category: product.categoryLabel ?? product.category,
    url: getProductUrl(product),
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 10)
    : 6;

  if (!query.trim()) {
    return Response.json({
      suggestions: [] as SearchSuggestion[],
      exactMatch: null as SearchSuggestion | null,
    });
  }

  try {
    const { products } = await getCatalogData();
    const exactMatch = getCatalogExactProductMatch(products, query);
    const suggestions = getCatalogSearchSuggestions(products, query, limit).map(toSuggestion);

    return Response.json({
      suggestions,
      exactMatch: exactMatch ? toSuggestion(exactMatch) : null,
    });
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return Response.json({
        suggestions: [] as SearchSuggestion[],
        exactMatch: null as SearchSuggestion | null,
      });
    }

    throw error;
  }
}
