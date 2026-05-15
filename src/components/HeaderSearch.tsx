"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { normalizeCatalogSearchValue } from "@/lib/catalog-search";

interface SearchSuggestion {
  code: string;
  name: string;
  brand: string;
  category: string;
  url: string;
}

interface SearchResponse {
  suggestions: SearchSuggestion[];
  exactMatch: SearchSuggestion | null;
}

interface HeaderSearchProps {
  buttonClassName: string;
  inputClassName: string;
  placeholder: string;
  submitIconSize?: number;
  wrapperClassName?: string;
  onNavigate?: () => void;
}

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_CACHE_LIMIT = 20;

function cacheSearchResult(
  cache: Map<string, SearchResponse>,
  query: string,
  result: SearchResponse
) {
  if (cache.has(query)) {
    cache.delete(query);
  }

  cache.set(query, result);

  if (cache.size > SEARCH_CACHE_LIMIT) {
    const oldestKey = cache.keys().next().value;

    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
}

function matchesSuggestionQuery(suggestion: SearchSuggestion | null, query: string): boolean {
  if (!suggestion) {
    return false;
  }

  const normalizedQuery = normalizeCatalogSearchValue(query);
  return (
    normalizedQuery !== "" &&
    (normalizeCatalogSearchValue(suggestion.name) === normalizedQuery ||
      normalizeCatalogSearchValue(suggestion.code) === normalizedQuery)
  );
}

export default function HeaderSearch({
  buttonClassName,
  inputClassName,
  placeholder,
  submitIconSize = 18,
  wrapperClassName,
  onNavigate,
}: HeaderSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [exactMatch, setExactMatch] = useState<SearchSuggestion | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SearchSuggestion | null>(null);
  const [resolvedQuery, setResolvedQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeCatalogSearchValue(trimmedQuery);
  const latestQueryRef = useRef(query);
  const searchCacheRef = useRef(new Map<string, SearchResponse>());
  const hasResolvedCurrentQuery = normalizedQuery !== "" && resolvedQuery === normalizedQuery;
  const showSuggestions =
    isFocused && trimmedQuery !== "" && (isLoading || suggestions.length > 0 || hasResolvedCurrentQuery);

  async function requestSearch(value: string, signal?: AbortSignal): Promise<SearchResponse> {
    const response = await fetch(
      `/api/catalog/search?q=${encodeURIComponent(value)}&limit=6`,
      {
        cache: "no-store",
        signal,
      }
    );

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    return (await response.json()) as SearchResponse;
  }

  function resetSearchState() {
    setSuggestions([]);
    setExactMatch(null);
    setSelectedSuggestion(null);
    setResolvedQuery("");
    setIsLoading(false);
    setQuery("");
    onNavigate?.();
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsFocused(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    latestQueryRef.current = query;
  }, [query]);

  useEffect(() => {
    const delay = query.trim() ? SEARCH_DEBOUNCE_MS : 0;
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const value = debouncedQuery.trim();
    const normalizedValue = normalizeCatalogSearchValue(value);

    if (!value || !normalizedValue) {
      return;
    }

    if (normalizeCatalogSearchValue(latestQueryRef.current.trim()) !== normalizedValue) {
      return;
    }

    const cachedResult = searchCacheRef.current.get(normalizedValue);

    if (cachedResult) {
      setSuggestions(cachedResult.suggestions);
      setExactMatch(cachedResult.exactMatch);
      setResolvedQuery(normalizedValue);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    void requestSearch(value, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) {
          return;
        }

        if (normalizeCatalogSearchValue(latestQueryRef.current.trim()) !== normalizedValue) {
          return;
        }

        cacheSearchResult(searchCacheRef.current, normalizedValue, result);
        setSuggestions(result.suggestions);
        setExactMatch(result.exactMatch);
        setResolvedQuery(normalizedValue);
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        if (normalizeCatalogSearchValue(latestQueryRef.current.trim()) !== normalizedValue) {
          return;
        }

        setSuggestions([]);
        setExactMatch(null);
        setResolvedQuery(normalizedValue);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedQuery) {
      return;
    }

    let resolvedExactMatch = exactMatch;

    if (normalizedQuery !== resolvedQuery) {
      const cachedResult = searchCacheRef.current.get(normalizedQuery);

      if (cachedResult) {
        resolvedExactMatch = cachedResult.exactMatch;
      } else {
        try {
          const result = await requestSearch(trimmedQuery);
          cacheSearchResult(searchCacheRef.current, normalizedQuery, result);
          resolvedExactMatch = result.exactMatch;
        } catch {
          resolvedExactMatch = null;
        }
      }
    }

    const productMatch =
      (matchesSuggestionQuery(selectedSuggestion, trimmedQuery) ? selectedSuggestion : null) ??
      (matchesSuggestionQuery(resolvedExactMatch, trimmedQuery) ? resolvedExactMatch : null);

    if (productMatch) {
      router.push(productMatch.url);
      resetSearchState();
      return;
    }

    router.push(`/collections?q=${encodeURIComponent(trimmedQuery)}`);
    resetSearchState();
  }

  return (
    <form onSubmit={handleSubmit} className={wrapperClassName}>
      <div ref={containerRef} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;

            setQuery(nextValue);
            setIsFocused(true);
            setSelectedSuggestion(null);

            if (!nextValue.trim()) {
              setSuggestions([]);
              setExactMatch(null);
              setResolvedQuery("");
              setIsLoading(false);
            } else {
              setSuggestions([]);
              setExactMatch(null);
              setResolvedQuery("");
              setIsLoading(true);
            }
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={placeholder}
          aria-haspopup="listbox"
          className={inputClassName}
        />

        <button type="submit" className={buttonClassName} aria-label="Buscar">
          <Search size={submitIconSize} />
        </button>

        {showSuggestions && (
          <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-xl">
            {suggestions.length > 0 ? (
              <div role="listbox" aria-label="Sugerencias de productos" className="py-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.code}
                    type="button"
                    role="option"
                    aria-selected={selectedSuggestion?.code === suggestion.code}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery(suggestion.name);
                      setSelectedSuggestion(suggestion);
                      setExactMatch(suggestion);
                      setIsLoading(false);
                      setResolvedQuery(normalizeCatalogSearchValue(suggestion.name));
                      setIsFocused(false);
                    }}
                    className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-light"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-dark">
                        {suggestion.name}
                      </span>
                      <span className="block truncate text-xs text-steel">
                        {suggestion.brand} · {suggestion.code}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-primary/70">
                      {suggestion.category}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-steel">
                {isLoading ? "Buscando productos..." : "No encontramos coincidencias."}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
