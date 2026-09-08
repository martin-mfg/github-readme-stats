import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    observer.disconnect();
  };
}

function isDark(): boolean {
  return document.documentElement.dataset["theme"] === "dark";
}

/**
 * Whether the site is showing its dark theme, which picks the default card theme.
 * Starlight and daisyUI both use `data-theme`, so the attribute is the state.
 */
export function useIsDarkTheme(): boolean {
  return useSyncExternalStore(subscribe, isDark, () => false);
}
