import { createFileRoute } from "@tanstack/react-router";

// Creates a fresh Whop checkout with the visitor's UTMs stored in metadata, so they come back on the payment webhook.
const ALLOWED = new Set([
  "ch_8Kf4x4fkLSGX3GO", "ch_UEZxbSu0T6r3j4A", "ch_4wj9dy0Ic8GUcy8", "ch_O3k7CrZb82pIAtF",
  "ch_iqM4iZfE54nDq1j", "ch_xiGqimh88bjKPeS", "ch_TxiPks24Hc9CfdE",
]);
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "src", "sck", "fbclid", "fbp", "fbc"];
const API = "https://api.whop.com/api/v1";

export const Route = createFileRoute("/api/public/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["WHOP_API_KEY"];
        let body: any;
        try { body = await request.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
        const id = String(body?.id ?? "");
        if (!key || !ALLOWED.has(id)) return Response.json({ error: "unavailable" }, { status: 400 });
        const metadata: Record<string, string> = {};
        for (const k of KEYS) {
          const v = body?.tracking?.[k];
          if (typeof v === "string" && v) metadata[k] = v.slice(0, 300);
        }
        const h = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
        try {
          const base = await fetch(`${API}/checkout_configurations/${id}`, { headers: h });
          if (!base.ok) throw new Error(`get ${base.status}`);
          const cfg: any = await base.json();
          const res = await fetch(`${API}/checkout_configurations`, {
            method: "POST", headers: h,
            body: JSON.stringify({ account_id: cfg.account_id, variant_id: cfg.variant?.id ?? cfg.plan?.id, redirect_url: cfg.redirect_url, mode: "payment", metadata }),
          });
          if (!res.ok) throw new Error(`create ${res.status}: ${await res.text()}`);
          const out: any = await res.json();
          return Response.json({ url: out.purchase_url });
        } catch (e) {
          console.error("dynamic checkout failed", String(e));
          return Response.json({ error: "failed" }, { status: 502 });
        }
      },
    },
  },
});
