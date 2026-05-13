"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type FbqFunction = (...args: unknown[]) => void;

function getFbq(): FbqFunction | undefined {
  return (window as Window & { fbq?: FbqFunction }).fbq;
}

export default function MetaPixelPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const queryString = searchParams.toString();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fbq = getFbq();
    if (typeof fbq === "function") {
      fbq("track", "PageView");
    }
  }, [pathname, queryString]);

  return null;
}
