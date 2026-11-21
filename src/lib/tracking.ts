// Browser-side ad tracking: Meta Pixel + UTM capture forwarded to Whop checkout links.
export const META_PIXEL_ID = "1541740401126606";
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid"];
const STORE = "sx_utm";

function readStored(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; }
}

export function captureUtms() {
  const q = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const k of KEYS) { const v = q.get(k); if (v) found[k] = v.slice(0, 200); }
  if (Object.keys(found).length) localStorage.setItem(STORE, JSON.stringify({ ...readStored(), ...found }));
}

function cookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1];
}

export function decorateCheckout(url: string) {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("whop.com")) return url;
    const s = readStored();
    for (const [k, v] of Object.entries(s)) if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    const fbp = cookie("_fbp"); const fbc = cookie("_fbc");
    if (fbp) u.searchParams.set("fbp", fbp);
    if (fbc) u.searchParams.set("fbc", fbc);
    return u.toString();
  } catch { return url; }
}

export function initTracking() {
  if (typeof window === "undefined" || (window as any).__sxTrack) return;
  (window as any).__sxTrack = true;
  captureUtms();
  // Utmify UTM script (official snippet, decoded).
  if (!document.querySelector("script[src*='cdn.utmify.com.br']")) {
    const u = document.createElement("script");
    u.src = "https://cdn.utmify.com.br/scripts/utms/latest.js";
    u.async = true; u.defer = true;
    u.setAttribute("data-utmify-prevent-xcod-sck", "");
    u.setAttribute("data-utmify-prevent-subids", "");
    document.head.appendChild(u);
  }
  /* eslint-disable */
  const w = window as any;
  if (!w.fbq) {
    const n: any = (w.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!w._fbq) w._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const t = document.createElement("script"); t.async = true; t.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(t);
  }
  w.fbq("init", META_PIXEL_ID);
  w.fbq("track", "PageView");
  // Rewrite Whop checkout links at click time so UTMs reach the sale.
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement)?.closest?.("a[href*='whop.com/checkout']") as HTMLAnchorElement | null;
    if (!a) return;
    a.href = decorateCheckout(a.href);
    w.fbq("track", "InitiateCheckout");
  }, true);
}

export function trackPageView() {
  (window as any).fbq?.("track", "PageView");
}
