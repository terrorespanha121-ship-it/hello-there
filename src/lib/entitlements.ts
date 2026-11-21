export type Product = "front" | "love" | "prosperity" | "shield";
export const UPSELLS: Product[] = ["love", "prosperity", "shield"];
const KEY = "sx_owned";
const ADMIN_KEY = "sx_admin";
const ADMIN_CODE = "jarik";
const VIEW_KEY = "sx_admin_view";
export const isAdmin = () => localStorage.getItem(ADMIN_KEY) === "1";
/** Admin-only: unlock with the secret word. Returns true when correct. */
export function enterAdmin(code: string): boolean {
  if (code.trim().toLowerCase() !== ADMIN_CODE) return false;
  localStorage.setItem(ADMIN_KEY, "1"); return true;
}
export function exitAdmin() { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem(VIEW_KEY); }
/** Admin-only preview: null = everything, [] = front only, or a list of upsells. */
export function setAdminView(v: Product[] | null) {
  if (v === null) localStorage.removeItem(VIEW_KEY); else localStorage.setItem(VIEW_KEY, v.join(",") || "none");
}

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
  const q = new URLSearchParams(location.search);
  if (q.get("admin") === ADMIN_CODE) localStorage.setItem(ADMIN_KEY, "1");
  if (q.get("admin") === "off") localStorage.removeItem(ADMIN_KEY);
  if (localStorage.getItem(ADMIN_KEY) === "1") {
    const v = localStorage.getItem(VIEW_KEY);
    return v ? mergeOwned([], parseBought(v)) : ["front", ...UPSELLS];
  }
  const owned = mergeOwned(stored, parseBought(q.get("bought")));
  localStorage.setItem(KEY, JSON.stringify(owned));
  return owned;
}
export function grant(p: Product) {
  const owned = mergeOwned(loadOwned(), [p]);
  localStorage.setItem(KEY, JSON.stringify(owned));
}
