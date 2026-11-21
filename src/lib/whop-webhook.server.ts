// Whop webhook helpers (Standard Webhooks signature) + Brevo delivery emails.
export type Product = "front" | "love" | "prosperity" | "shield";

export const PLAN_TO_PRODUCT: Record<string, Product> = {
  plan_B7uUAUp9gdfSH: "front",
  plan_bZraOfdRUCTGm: "love",
  plan_XwPkk2V3E9wNW: "love",
  plan_YwEwLwMnWtodI: "prosperity",
  plan_Q7dYpQIFv8khA: "prosperity",
  plan_8no2N6BqiV24Y: "shield",
  plan_JBwRz2KExCBxV: "shield",
};

const enc = new TextEncoder();

function b64ToBytes(b64: string): Uint8Array | null {
  try {
    const bin = atob(b64);
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmacB64(key: Uint8Array, msg: string) {
  const k = await crypto.subtle.importKey("raw", key as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
  return btoa(String.fromCharCode(...sig));
}

function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function verifyWhop(body: string, headers: Headers, secret: string) {
  const id = headers.get("webhook-id");
  const ts = headers.get("webhook-timestamp");
  const sigHeader = headers.get("webhook-signature");
  if (!id || !ts || !sigHeader) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 600) return false;
  const msg = `${id}.${ts}.${body}`;
  // Candidate keys: the whole secret as bytes (Whop SDK) or base64 part after prefix (Standard Webhooks).
  const keys: Uint8Array[] = [enc.encode(secret)];
  const stripped = secret.replace(/^(ws_|whsec_)/, "");
  const dec = b64ToBytes(stripped);
  if (dec) keys.push(dec);
  const sigs = sigHeader.split(" ").map((s) => s.split(",")[1] ?? "").filter(Boolean);
  for (const k of keys) {
    const expected = await hmacB64(k, msg);
    if (sigs.some((s) => safeEq(s, expected))) return true;
  }
  return false;
}

type Lang = "es" | "pt" | "br" | "en";
const ES = ["ES","MX","AR","CO","CL","PE","VE","EC","GT","CU","BO","DO","HN","PY","SV","NI","CR","PA","UY","PR"];
export function langFor(country?: string | null): Lang {
  const c = (country ?? "").toUpperCase();
  if (c === "PT" || c === "AO" || c === "MZ") return "pt";
  if (c === "BR") return "br";
  if (ES.includes(c)) return "es";
  return "en";
}

const SITE = "https://little-idea-big-world.lovable.app";
const INFO: Record<Product, { title: string; pdf: string }> = {
  front: { title: "The Sacred Golden Scroll", pdf: "/downloads/sacred-golden-scroll.pdf" },
  love: { title: "The Sacred Flame", pdf: "/downloads/sacred-flame-love-reading.pdf" },
  prosperity: { title: "Vault of Abundance 2027", pdf: "/downloads/vault-of-abundance-2027.pdf" },
  shield: { title: "The Sacred Shield", pdf: "/downloads/sacred-shield-7-day-ritual.pdf" },
};

const T: Record<Lang, { subj: string; hi: string; body: string; dl: string; app: string; bill: string; help: string }> = {
  en: { subj: "Your reading is ready", hi: "Dear", body: "Thank you for trusting the cards. Your purchase is confirmed and your material is ready right now.", dl: "Download my eBook", app: "Enter my Sacred Sanctuary", bill: "On your statement this purchase appears as Jarik.co / Whop.", help: "Any question or access problem? Just reply to this email and we will help you personally." },
  es: { subj: "Tu lectura está lista", hi: "Querida", body: "Gracias por confiar en las cartas. Tu compra está confirmada y tu material ya está disponible.", dl: "Descargar mi eBook", app: "Entrar a mi Santuario Sagrado", bill: "En tu extracto esta compra aparece como Jarik.co / Whop.", help: "¿Alguna duda o problema de acceso? Responde a este email y te ayudaremos personalmente." },
  pt: { subj: "A tua leitura está pronta", hi: "Querida", body: "Obrigada por confiares nas cartas. A tua compra está confirmada e o teu material já está disponível.", dl: "Descarregar o meu eBook", app: "Entrar no meu Santuário Sagrado", bill: "No teu extrato esta compra aparece como Jarik.co / Whop.", help: "Alguma dúvida ou problema de acesso? Responde a este email e ajudamos-te pessoalmente." },
  br: { subj: "Sua leitura está pronta", hi: "Querida", body: "Obrigada por confiar nas cartas. Sua compra está confirmada e seu material já está disponível.", dl: "Baixar meu eBook", app: "Entrar no meu Santuário Sagrado", bill: "Na sua fatura esta compra aparece como Jarik.co / Whop.", help: "Alguma dúvida ou problema de acesso? Responda este email e ajudaremos você pessoalmente." },
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function buildEmail(product: Product, lang: Lang, name: string) {
  const t = T[lang];
  const p = INFO[product];
  const app = `${SITE}/members?bought=${product}`;
  const html = `<div style="background:#0d0a07;padding:32px 16px;font-family:Georgia,serif;color:#eadbb8">
<div style="max-width:560px;margin:0 auto;border:1px solid #8a6d3b;padding:32px;background:#15110b">
<p style="text-align:center;color:#c9a45c;letter-spacing:4px;font-size:12px">✦ JARIK.CO ✦</p>
<h1 style="text-align:center;color:#e8c77a;font-weight:normal">${esc(p.title)}</h1>
<p>${t.hi} ${esc(name)},</p><p>${t.body}</p>
<p style="text-align:center;margin:28px 0"><a href="${SITE}${p.pdf}" style="background:#c9a45c;color:#15110b;padding:14px 24px;text-decoration:none">${t.dl}</a></p>
<p style="text-align:center"><a href="${app}" style="color:#e8c77a">${t.app}</a></p>
<hr style="border:none;border-top:1px solid #3a2e1c;margin:24px 0"/>
<p style="font-size:13px;color:#a8977a">${t.bill}</p><p style="font-size:13px;color:#a8977a">${t.help}</p>
</div></div>`;
  return { subject: `${t.subj} — ${p.title}`, html };
}

export async function sendBrevo(to: string, name: string, subject: string, html: string) {
  const lov = process.env["LOVABLE_API_KEY"];
  const brevo = process.env["BREVO_API_KEY"];
  if (!lov || !brevo) throw new Error("Email keys not configured");
  const res = await fetch("https://connector-gateway.lovable.dev/brevo/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": brevo },
    body: JSON.stringify({
      sender: { name: "Jarik.co", email: "jairhussain4@gmail.com" },
      replyTo: { email: "jairhussain4@gmail.com", name: "Jarik.co" },
      to: [{ email: to, name }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) throw new Error(`Brevo failed [${res.status}]: ${await res.text()}`);
}
