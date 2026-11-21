import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import loveVideo from "@/assets/love-intro-v3.mp4.asset.json";
import cardsVideo from "@/assets/love-cards-voice-v2.mp4.asset.json";
import { ScratchCard } from "@/components/ScratchCard";
import closingVideo from "@/assets/love_closing_v3.mp4.asset.json";

export const Route = createFileRoute("/upsell-love")({
  head: () => ({
    meta: [
      { title: "Wait — Your Love Cards Are Calling" },
      { name: "description", content: "A special love & soulmate reading revealed only for you, right after your 2026 reading." },
      { property: "og:title", content: "Wait — Your Love Cards Are Calling" },
      { property: "og:description", content: "Choose your 3 love cards and discover who is about to cross your path." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UpsellLove,
});

// Replace with your Whoop one-click upsell link.
const UPSELL_CHECKOUT_URL = "https://whop.com/checkout/ch_UEZxbSu0T6r3j4A/";
// 40% off downsell offered when the visitor declines
const DOWNSELL_CHECKOUT_URL = "https://whop.com/checkout/ch_4wj9dy0Ic8GUcy8/";

const LOVE_CARDS = [
  { name: "The Hidden Lover", hint: "Someone from your past still carries your energy…", img: "/images/card-fool.jpg" },
  { name: "The Wheel of Love", hint: "A date in the next 3 weeks changes everything…", img: "/images/card-wheel.jpg" },
  { name: "The Inevitable Meeting", hint: "Their name begins with a letter the cards just showed me…", img: "/images/card-tower.jpg" },
];

type Stage = "video" | "choice" | "cards" | "reading" | "closing" | "offer" | "scratch";

function UpsellLove() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const syncBg = () => {
    const v = videoRef.current, b = bgRef.current;
    if (!v || !b) return;
    if (b.src !== v.currentSrc && v.currentSrc) b.src = v.currentSrc;
    if (Math.abs(b.currentTime - v.currentTime) > 0.3) b.currentTime = v.currentTime;
    if (v.paused) b.pause(); else b.play().catch(() => {});
  };
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState<Stage>("video");
  const [scratched, setScratched] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);


  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setStarted(true))
      .catch(() => {
        v.muted = true;
        v.play().then(() => setStarted(true)).catch(() => {});
        const unmute = () => { v.muted = false; v.play().catch(() => {}); };
        window.addEventListener("pointerdown", unmute, { once: true });
        window.addEventListener("touchstart", unmute, { once: true });
      });
    // preload next videos for seamless transitions
    [cardsVideo.url, closingVideo.url].forEach((u) => {
      const pre = document.createElement("link");
      pre.rel = "preload"; pre.as = "video"; pre.href = u;
      document.head.appendChild(pre);
      fetch(u).catch(() => {});
    });
  }, []);

  const playClosing = () => {
    setStage("closing");
    const v = videoRef.current;
    if (!v) return;
    v.src = closingVideo.url;
    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    v.play().catch((err) => {
      if (err?.name !== "AbortError") setStage("offer");
    });
  };

  const flip = (i: number) => {
    if (flipped.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 3) setTimeout(playClosing, 900);
  };

  const readerChooses = () => {
    setStage("reading");
    const v = videoRef.current;
    if (!v) return;
    v.src = cardsVideo.url;
    v.muted = false;
    v.volume = 0.6;
    v.currentTime = 0;
    v.play();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <video
        ref={videoRef}
        onPlay={syncBg}
        onPause={syncBg}
        onSeeked={syncBg}
        onTimeUpdate={(e) => {
          syncBg();
          if (stage === "closing" && e.currentTarget.currentSrc.includes("love_closing_v3") && e.currentTarget.currentTime >= 16) setStage("offer");
        }}
        src={loveVideo.url}
        poster="/images/reader-portrait.jpg"
        playsInline
        onEnded={() => {
          if (stage === "reading") return playClosing();
          setStage((s) => (s === "video" ? "choice" : s === "closing" ? "offer" : s));
        }}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 scale-[1.08] md:scale-100 md:object-contain"
        style={{
          objectPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      <div className="absolute inset-x-0 top-0 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Wait — your reading isn't complete</p>
      </div>


      <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-8">
        {stage === "reading" && (
          <p className="text-center text-sm text-foreground/80">Your reader is drawing your cards •••</p>
        )}

        {stage === "closing" && (
          <p className="text-center text-sm text-foreground/80">Your reader has a message for you •••</p>
        )}

        {stage === "video" && started && (
          <p className="text-center text-sm text-foreground/80">Your reader is speaking •••</p>
        )}

        {stage === "choice" && (
          <div className="fade-in mx-auto flex max-w-md flex-col gap-3">
            <h2 className="mb-2 text-center font-display text-3xl text-gold">How will your love cards be drawn?</h2>
            <button onClick={() => setStage("cards")} className="h-14 bg-gold-gradient font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
              I'll choose my 3 cards
            </button>
            <button onClick={readerChooses} className="h-14 border border-gold/60 bg-panel font-medium uppercase tracking-wide text-gold">
              I trust your intuition
            </button>
          </div>
        )}

        {stage === "cards" && (
          <div className="fade-in mx-auto max-w-md">
            <h2 className="mb-4 text-center font-display text-2xl text-gold">
              {flipped.length < 3 ? "Touch each card to reveal it" : "The cards have spoken…"}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {LOVE_CARDS.map((c, i) => {
                const open = flipped.includes(i);
                return (
                  <button key={c.name} onClick={() => flip(i)} className="flex flex-col items-center gap-2">
                    <img
                      src={open ? c.img : "/images/card-back.jpg"}
                      alt={open ? c.name : "Face-down card"}
                      className={`aspect-[2/3] w-full border border-gold/50 object-cover transition-transform duration-700 ${open ? "" : "animate-pulse"}`}
                    />
                    {open && <span className="fade-in text-center text-[11px] text-gold">{c.name}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {stage === "offer" && (
          <div className="fade-in mx-auto max-w-md border border-gold/40 bg-panel p-5">
            <h2 className="text-center font-display text-2xl text-gold">Your cards revealed a hidden truth</h2>
            <ul className="mt-3 space-y-2 text-sm text-foreground/85">
              {LOVE_CARDS.map((c) => (
                <li key={c.name}>✦ <b className="text-gold">{c.name}:</b> {c.hint}</li>
              ))}
            </ul>
            <p className="mt-4 text-center text-sm">
              Add your <b>Complete Love & Soulmate Reading</b> to your order — only <b className="text-gold">$27</b>, one time.
            </p>
            <a href={UPSELL_CHECKOUT_URL} className="mt-4 flex h-14 items-center justify-center bg-gold-gradient text-center text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
              Yes, reveal my love destiny ($27)
            </a>
            <button onClick={() => setStage("scratch")} className="mt-3 block w-full text-center text-xs text-foreground/50 underline">
              No thanks, I'll leave my love life to chance…
            </button>
          </div>
        )}

        {stage === "scratch" && (
          <div className="fade-in mx-auto max-w-md border border-gold/40 bg-panel p-5 text-center">
            <h2 className="font-display text-2xl text-gold">Wait… one card refused to stay in the deck</h2>
            <p className="mt-2 text-sm text-foreground/80">Scratch the card with your finger to see what the universe saved for you.</p>
            <div className="mt-4">
              <ScratchCard onReveal={() => setScratched(true)}>
                <div className="flex h-full w-full flex-col items-center justify-center bg-panel p-4">
                  <span className="text-xs uppercase tracking-widest text-foreground/70">You received</span>
                  <span className="font-display text-6xl text-gold">40%</span>
                  <span className="text-sm font-medium uppercase tracking-wide text-gold">OFF</span>
                  <span className="mt-2 text-xs text-foreground/70">your Love & Soulmate Reading</span>
                </div>
              </ScratchCard>
            </div>
            {scratched && (
              <div className="fade-in">
                <p className="mt-4 text-sm">
                  <s className="text-foreground/50">$27</s> <b className="text-2xl text-gold">$16</b> — only on this page.
                </p>
                <a href={DOWNSELL_CHECKOUT_URL} className="mt-3 flex h-14 items-center justify-center bg-gold-gradient text-center text-sm font-medium uppercase tracking-wide text-primary-foreground shadow-cta">
                  Yes! Claim my 40% love discount ($16)
                </a>
                <Link to="/upsell-prosperity" className="mt-3 block text-center text-xs text-foreground/50 underline">
                  No, continue to the next step →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
