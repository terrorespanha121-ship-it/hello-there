export type Product = "front" | "love" | "prosperity" | "shield";
export const UPSELLS: Product[] = ["love", "prosperity", "shield"];
const KEY = "sx_owned";

/** Front is always owned; upsells only when bought. Accepts "?bought=love,shield". */
export function parseBought(raw: string | null): Product[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim().toLowerCase()).filter((s): s is Product => (UPSELLS as string[]).includes(s));
}
export function mergeOwned(stored: Product[], incoming: Product[]): Product[] {
  return Array.from(new Set<Product>(["front", ...stored, ...incoming]));
}
export function loadOwned(): Product[] {
  let stored: Product[] = [];
  try { stored = parseBought((JSON.parse(localStorage.getItem(KEY) || "[]") as string[]).join(",")); } catch { /* noop */ }
  const owned = mergeOwned(stored, parseBought(new URLSearchParams(location.search).get("bought")));
  localStorage.setItem(KEY, JSON.stringify(owned));
  return owned;
}
export function grant(p: Product) {
  const owned = mergeOwned(loadOwned(), [p]);
  localStorage.setItem(KEY, JSON.stringify(owned));
}
