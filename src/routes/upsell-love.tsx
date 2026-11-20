import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import loveVideo from "@/assets/love-intro-soft.mp4.asset.json";
import cardsVideo from "@/assets/love-cards-voice.mp4.asset.json";

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
const UPSELL_CHECKOUT_URL = "https://checkout.whoop.example/love-reading";

const LOVE_CARDS = [
  { name: "The Hidden Lover", hint: "Someone from your past still carries your energy…", img: "/images/card-fool.jpg" },
  { name: "The Wheel of Love", hint: "A date in the next 3 weeks changes everything…", img: "/images/card-wheel.jpg" },
  { name: "The Inevitable Meeting", hint: "Their name begins with a letter the cards just showed me…", img: "/images/card-tower.jpg" },
];

type Stage = "video" | "choice" | "cards" | "reading" | "offer";

function UpsellLove() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState<Stage>("video");
  const [flipped, setFlipped] = useState<number[]>([]);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play();
    setStarted(true);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setStarted(true))
      .catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
  }, []);

  const flip = (i: number) => {
    setFlipped((prev) => {
      if (prev.includes(i)) return prev;
      const next = [...prev, i];
      if (next.length === 3) setTimeout(() => setStage("offer"), 1400);
      return next;
    });
  };

  const readerChooses = () => {
    setStage("reading");
    const v = videoRef.current;
    if (!v) return;
    v.src = cardsVideo.url;
    v.muted = false;
    v.currentTime = 0;
    v.play();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <video
        ref={videoRef}
        src={loveVideo.url}
        poster="/images/reader-portrait.jpg"
        playsInline
        onEnded={() => setStage((s) => (s === "video" ? "choice" : s === "reading" ? "offer" : s))}
        className="absolute inset-0 h-full w-full object-cover md:object-contain"
        style={{ objectPosition: stage === "reading" || stage === "offer" ? "center" : "center" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute inset-x-0 top-0 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Wait — your reading isn't complete</p>
      </div>

      {!started && (
        <button onClick={start} className="absolute inset-0 z-10 flex items-center justify-center bg-background/40">
          <span className="border border-gold/60 bg-panel px-6 py-4 font-display text-xl text-gold">🔊 Tap to hear your reader</span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-8">
        {stage === "reading" && (
          <p className="text-center text-sm text-foreground/80">Your reader is drawing your cards •••</p>
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
            <Link to="/" className="mt-3 block text-center text-xs text-foreground/50 underline">
              No thanks, I'll leave my love life to chance…
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
