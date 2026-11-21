import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import shieldAsset from "@/assets/shield_ritual.mp4.asset.json";

export const Route = createFileRoute("/upsell-shield")({
  head: () => ({
    meta: [
      { title: "7-Day Sacred Shield & Sealing Ritual" },
      { name: "description", content: "Your reader consecrates a candle with your name on her altar for 7 days to protect your love and prosperity." },
      { property: "og:title", content: "7-Day Sacred Shield & Sealing Ritual" },
      { property: "og:description", content: "Seal your protection before the door closes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UpsellShield,
});

// Replace with your Whoop one-click link when ready.
const CHECKOUT_URL = "#checkout-shield-37";
const OFFER_AT = 72; // seconds: "only twelve names" → button call

function UpsellShield() {
  const ref = useRef<HTMLVideoElement>(null);
  const [offer, setOffer] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
      const unmute = () => { v.muted = false; v.play().catch(() => {}); };
      window.addEventListener("pointerdown", unmute, { once: true });
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <video
        ref={ref}
        src={shieldAsset.url}
        poster="/images/reader-portrait.jpg"
        playsInline
        autoPlay
        preload="auto"
        onTimeUpdate={(e) => { if (!offer && e.currentTarget.currentTime >= OFFER_AT) setOffer(true); }}
        onEnded={() => setOffer(true)}
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover md:scale-100 md:object-contain"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Your protection is not sealed yet</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-8">
        {!offer && <p className="text-center text-sm text-foreground/80">Your reader is speaking •••</p>}
        {offer && (
          <div className="fade-in mx-auto max-w-md border border-gold/40 bg-panel p-5">
            <h2 className="text-center font-display text-2xl text-gold">7-Day Sacred Shield & Sealing Ritual</h2>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              <li>🕯️ <b className="text-gold">A candle with your name</b> consecrated on her altar for 7 days</li>
              <li>🛡️ <b className="text-gold">A shield around</b> your love, your money and your peace</li>
              <li>✦ <b className="text-gold">Cords cut</b> from envy and the ties of your past</li>
            </ul>
            <p className="mt-3 text-center text-xs text-foreground/70">Only <b className="text-gold">12 names</b> per cycle — <b className="text-gold">3 spaces left</b></p>
            <p className="mt-2 text-center text-sm">One time — <b className="text-2xl text-gold">$37</b></p>
            <a href={CHECKOUT_URL} className="mt-4 flex h-14 items-center justify-center bg-gold-gradient text-center text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
              Yes, seal my protection ($37)
            </a>
            <Link to="/" className="mt-3 block text-center text-xs text-foreground/50 underline">
              No thanks, I'll leave my energy unprotected →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
