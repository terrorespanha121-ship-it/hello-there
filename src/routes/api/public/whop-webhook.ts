import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/whop-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHOP_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 500 });
        const body = await request.text();
        const { verifyWhop, PLAN_TO_PRODUCT, PLAN_PRICE_USD, trackingFrom, sendUtmify, sendMetaPurchase, langFor, buildEmail, sendBrevo } = await import("@/lib/whop-webhook.server");
        if (!(await verifyWhop(body, request.headers, secret))) return new Response("Invalid signature", { status: 401 });

        let evt: any;
        try { evt = JSON.parse(body); } catch { return new Response("Bad JSON", { status: 400 }); }
        const type = evt?.type ?? evt?.action;
        if (type !== "payment.succeeded") return new Response("ignored");

        const d = evt.data ?? {};
        const planId: string | undefined = d.variant_id ?? d.line_items?.[0]?.variant_id ?? d.plan?.id ?? d.plan_id;
        const product = planId ? PLAN_TO_PRODUCT[planId] : undefined;
        const email: string | undefined = d.customer_email ?? d.user?.email ?? d.email;
        if (!product || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          console.log("whop webhook: skipped", planId);
          return new Response("skipped");
        }
        const name = String(d.user?.name || d.billing_address?.name || d.user?.username || "Soul").slice(0, 80);
        const country = d.billing_address?.country ?? d.user?.country ?? null;
        const { subject, html } = buildEmail(product, langFor(country), name);
        const orderId = String(d.id ?? request.headers.get("webhook-id") ?? `${planId}-${email}`);
        const usd = PLAN_PRICE_USD[planId!] ?? 0;
        const tk = trackingFrom(d);
        const created = d.created_at ? new Date(typeof d.created_at === "number" ? d.created_at * 1000 : d.created_at) : new Date();
        const when = isNaN(created.getTime()) ? new Date() : created;
        // Same orderId/event_id on every retry, so Utmify and Meta deduplicate instead of double-counting.
        const results = await Promise.allSettled([
          sendBrevo(email, name, subject, html),
          sendUtmify({ orderId, planId: planId!, product, usd, email, name, country, tk, created: when }),
          sendMetaPurchase({ eventId: orderId, product, usd, email, name, country, tk, created: when, ip: d.ip_address ?? null, ua: d.user_agent ?? null }),
        ]);
        const failed = results.map((r, i) => (r.status === "rejected" ? ["brevo", "utmify", "meta"][i] + ": " + String(r.reason) : null)).filter(Boolean);
        if (failed.length) {
          console.error("whop webhook partial failure", failed);
          return new Response("retry", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
