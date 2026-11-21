import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import introAsset from "@/assets/prosperity_intro.mp4.asset.json";
import painAsset from "@/assets/prosperity_pain.mp4.asset.json";

export const Route = createFileRoute("/upsell-prosperity")({
  head: () => ({
    meta: [
      { title: "Your 2027 Prosperity Blueprint — Opened Only For You" },
      { name: "description", content: "A private 2027 prosperity reading your reader has never revealed to anyone before." },
      { property: "og:title", content: "Your 2027 Prosperity Blueprint" },
      { property: "og:description", content: "Seal your personal 2027 prosperity map before this page closes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UpsellProsperity,
});

// Replace with your Whoop one-click links when ready.
const MAIN_CHECKOUT_URL = "#checkout-prosperity-97";
const DISCOUNT_CHECKOUT_URL = "#checkout-prosperity-67";
// Set to the HeyGen intro video once uploaded (null = portrait image).
const INTRO_VIDEO_URL: string | null = introAsset.url;

const PAINS = [
  { label: "I work non-stop, but my account is always back to zero", reveal: "An energy drain is pulling every gain back to zero. Your 2027 map shows exactly when this cycle breaks." },
  { label: "I'm in debt and feel I'll never climb out of this hole", reveal: "A heavy debt pattern is tied to your timeline. Your 2027 map reveals the exact months it can finally lift." },
  { label: "I know I deserve more, but an invisible wall blocks my way", reveal: "A hidden block is standing between you and abundance. Your 2027 map shows the rare window when it opens." },
];
// The wheel always lands on 50% OFF (slice index 0)
const SLICES = ["50% OFF", "10% OFF", "20% OFF", "5% OFF", "30% OFF", "15% OFF"];

type Stage = "video" | "seal" | "pain" | "offer" | "wheel";

function UpsellProsperity() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const painRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>(INTRO_VIDEO_URL ? "video" : "seal");
  const [seal, setSeal] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
      const unmute = () => { v.muted = false; v.play().catch(() => {}); };
      window.addEventListener("pointerdown", unmute, { once: true });
    });
  }, []);

  const pickSeal = (i: number) => {
    setSeal(i);
    const v = painRef.current;
    if (v) { v.muted = false; v.currentTime = 0; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }
    videoRef.current?.pause();
    setStage("pain");
  };

  const spin = () => {
    setStage("wheel");
    setWon(false);
    // land slice 0 under the top pointer: 6 full turns + small offset inside slice
    setTimeout(() => setRotation(360 * 7 - 30), 50);
    setTimeout(() => setWon(true), 4300);
  };

  const sliceAngle = 360 / SLICES.length;
  const gradient = SLICES.map((_, i) =>
    `${i % 2 ? "var(--panel)" : "var(--gold)"} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`).join(", ");

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {INTRO_VIDEO_URL ? (
        <video
          ref={videoRef}
          src={INTRO_VIDEO_URL}
          poster="/images/reader-portrait.jpg"
          playsInline
          autoPlay
          onEnded={() => setStage((s) => (s === "video" ? "seal" : s))}
          className={`absolute inset-0 h-full w-full scale-[1.08] object-cover md:scale-100 md:object-contain ${seal !== null && stage !== "seal" ? "invisible" : ""}`}
        />
      ) : null}
      {INTRO_VIDEO_URL && (
        <video
          ref={painRef}
          src={painAsset.url}
          preload="auto"
          playsInline
          onEnded={() => setStage((s) => (s === "pain" ? "offer" : s))}
          onTimeUpdate={(e) => { const v = e.currentTarget; if (stage === "pain" && v.duration && v.currentTime >= v.duration - 10) setStage("offer"); }}
          className={`absolute inset-0 h-full w-full scale-[1.08] object-cover md:scale-100 md:object-contain ${seal !== null && stage !== "seal" ? "" : "invisible"}`}
        />
      )}
      {!INTRO_VIDEO_URL && (
        <img src="/images/reader-portrait.jpg" alt="Your reader" className="absolute inset-0 h-full w-full object-cover md:object-contain" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

      <div className="absolute inset-x-0 top-0 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Do not close this page</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-8">
        {(stage === "video" || stage === "pain") && <p className="text-center text-sm text-foreground/80">Your reader is speaking •••</p>}

        {stage === "seal" && (
          <div className="fade-in mx-auto max-w-md text-center">
            <h2 className="mb-2 font-display text-2xl text-gold">What invisible chain is choking your finances?</h2>
            <p className="mb-4 text-sm text-foreground/80">Be honest. Your answer opens your 2027 Prosperity Vault.</p>
            <div className="space-y-2">
              {PAINS.map((p, i) => (
                <button key={p.label} onClick={() => seal === null && pickSeal(i)}
                  className={`w-full border border-gold/40 bg-panel p-3 text-left text-sm transition-all duration-500 ${seal === i ? "scale-[1.02] border-gold shadow-cta text-gold" : seal === null ? "" : "opacity-30"}`}>
                  🔴 {p.label}
                </button>
              ))}
            </div>
            {seal !== null && <p className="fade-in mt-4 text-sm text-gold">Reading your 2027 financial energy…</p>}
          </div>
        )}

        {stage === "offer" && (
          <div className="fade-in mx-auto max-w-md border border-gold/40 bg-panel p-5">
            <h2 className="text-center font-display text-2xl text-gold">Your 2027 Prosperity Blueprint is unlocked</h2>
            {seal !== null && <p className="mt-2 text-center text-sm italic text-foreground/85">“{PAINS[seal]?.reveal}”</p>}
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              <li>✦ <b className="text-gold">Your 12-month money map:</b> the exact months to act and to wait</li>
              <li>✦ <b className="text-gold">The financial block:</b> what keeps money slipping away — and how to clear it</li>
              <li>✦ <b className="text-gold">Your abundance window:</b> the rare 2027 dates opened for you</li>
            </ul>
            <p className="mt-4 text-center text-sm">Opened only for you — <b className="text-gold">$97</b>, one time.</p>
            <a href={MAIN_CHECKOUT_URL} className="mt-4 flex h-14 items-center justify-center bg-gold-gradient text-center text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
              Yes, unlock my 2027 prosperity ($97)
            </a>
            <button onClick={spin} className="mt-3 block w-full text-center text-xs text-foreground/50 underline">
              No thanks, I'll leave my finances to chance…
            </button>
          </div>
        )}

        {stage === "wheel" && (
          <div className="fade-in mx-auto max-w-md border border-gold/40 bg-panel p-5 text-center">
            <h2 className="font-display text-2xl text-gold">Wait… the Wheel of Fortune is turning for you</h2>
            <div className="relative mx-auto mt-4 h-56 w-56">
              <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-foreground" />
              <div
                className="h-full w-full rounded-full border-4 border-gold shadow-cta"
                style={{ background: `conic-gradient(${gradient})`, transform: `rotate(${rotation}deg)`, transition: "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)" }}
              >
                {SLICES.map((s, i) => (
                  <span key={s} className="absolute left-1/2 top-1/2 text-[11px] font-bold"
                    style={{ transform: `rotate(${i * sliceAngle + sliceAngle / 2}deg) translateY(-80px) translateX(-50%)`, transformOrigin: "0 0", color: i % 2 ? "var(--gold)" : "var(--primary-foreground)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {won && (
              <div className="fade-in">
                <p className="mt-4 font-display text-3xl text-gold">You won 50% OFF!</p>
                <p className="mt-1 text-sm"><s className="text-foreground/50">$97</s> <b className="text-2xl text-gold">$67</b> — only on this page.</p>
                <a href={DISCOUNT_CHECKOUT_URL} className="mt-3 flex h-14 items-center justify-center bg-gold-gradient text-center text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
                  Yes! Claim my discounted access ($67)
                </a>
                <Link to="/" className="mt-3 block text-center text-xs text-foreground/50 underline">
                  No thanks, continue to the next step →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
