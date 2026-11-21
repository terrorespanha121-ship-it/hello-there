import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/whop-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHOP_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 500 });
        const body = await request.text();
        const { verifyWhop, PLAN_TO_PRODUCT, langFor, buildEmail, sendBrevo } = await import("@/lib/whop-webhook.server");
        if (!(await verifyWhop(body, request.headers, secret))) return new Response("Invalid signature", { status: 401 });

        let evt: any;
        try { evt = JSON.parse(body); } catch { return new Response("Bad JSON", { status: 400 }); }
        const type = evt?.type ?? evt?.action;
        if (type !== "payment.succeeded") return new Response("ignored");

        const d = evt.data ?? {};
        const planId: string | undefined = d.plan?.id ?? d.plan_id;
        const product = planId ? PLAN_TO_PRODUCT[planId] : undefined;
        const email: string | undefined = d.user?.email ?? d.email;
        if (!product || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          console.log("whop webhook: skipped", planId);
          return new Response("skipped");
        }
        const name = String(d.user?.name || d.billing_address?.name || d.user?.username || "Soul").slice(0, 80);
        const country = d.billing_address?.country ?? d.user?.country ?? null;
        const { subject, html } = buildEmail(product, langFor(country), name);
        try {
          await sendBrevo(email, name, subject, html);
        } catch (e) {
          console.error(e);
          return new Response("email failed", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
