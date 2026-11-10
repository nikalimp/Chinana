"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// При переходе на другую страницу — сразу в самый верх, без анимации.
// Next.js прокручивает только к началу новой страницы под шапкой и иногда не прокручивает вовсе, если она уже видна.
export function ScrollTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (location.hash) return; // ссылка на якорь — браузер сам прокрутит к нему
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
