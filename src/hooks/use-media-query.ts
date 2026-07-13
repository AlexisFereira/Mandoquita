import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onChange: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMediaQuerySnapshot(query: string) {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => getMediaQuerySnapshot(query),
    () => false,
  );
}
