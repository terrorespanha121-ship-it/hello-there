import { createFileRoute } from "@tanstack/react-router";

// Browser events (PageView, InitiateCheckout) mirrored server-side to Meta CAPI with the same event_id as the Pixel for deduplication.
const ALLOWED = new Set(["PageView", "InitiateCheckout"]);

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["FB_CAPI_TOKEN"];
        if (!token) return new Response("not configured", { status: 500 });
        let b: any;
        try { b = await request.json(); } catch { return new Response("bad", { status: 400 }); }
        const name = String(b?.event_name ?? "");
        const id = String(b?.event_id ?? "").slice(0, 100);
        const url = String(b?.url ?? "").slice(0, 500);
        if (!ALLOWED.has(name) || !id || !url.startsWith("https://little-idea-big-world.lovable.app")) return new Response("bad", { status: 400 });
        const { META_PIXEL_ID } = await import("@/lib/whop-webhook.server");
        const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
        const user_data: Record<string, unknown> = {
          client_ip_address: ip || undefined,
          client_user_agent: request.headers.get("user-agent") || undefined,
          fbp: typeof b.fbp === "string" ? b.fbp.slice(0, 200) : undefined,
          fbc: typeof b.fbc === "string" ? b.fbc.slice(0, 300) : undefined,
        };
        const res = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [{ event_name: name, event_time: Math.floor(Date.now() / 1000), event_id: id, action_source: "website", event_source_url: url, user_data: JSON.parse(JSON.stringify(user_data)) }] }),
        });
        return new Response(res.ok ? "ok" : "fail", { status: res.ok ? 200 : 502 });
      },
    },
  },
});
