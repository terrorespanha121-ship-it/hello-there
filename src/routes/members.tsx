import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Your Sacred Sanctuary" },
      { name: "description", content: "Your living altar, daily golden card, sacred frequencies and crystal oracle." },
      { property: "og:title", content: "Your Sacred Sanctuary" },
      { property: "og:description", content: "Your living altar, daily golden card, sacred frequencies and crystal oracle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Sanctuary,
});

// Placeholder checkout links — swap for real Whop links.
const OFFERS = {
  emergency: { title: "Emergency Reading with the Reader", price: "$27", old: "$97", url: "#whop-emergency", desc: "A deep Celtic Cross on the hidden presence the card revealed — answered in your name." },
  candle: { title: "21-Day Acceleration Candle", price: "$67", old: "$147", url: "#whop-candle", desc: "The Reader lights a physical 21-day candle for your intention on her altar." },
  synastry: { title: "Love Synastry Map", price: "$29", old: "$79", url: "#whop-synastry", desc: "Your birth date + theirs: soulmate or past-life lesson?" },
  moon: { title: "Moon Circle Club", price: "$14.90/mo", old: "$39", url: "#whop-moon", desc: "New & Full Moon rituals every 15 days, guided by the Reader." },
} as const;
type OfferKey = keyof typeof OFFERS;

const CARDS = [
  { name: "The Star", glyph: "✶", msg: "Hope returns. Something you thought lost is quietly finding its way back." },
  { name: "The Lovers", glyph: "♡", msg: "A choice of the heart is near. Follow what makes your chest feel warm." },
  { name: "Wheel of Fortune", glyph: "☸", msg: "The cycle turns in your favour. Say yes to the unexpected invitation." },
  { name: "The Sun", glyph: "☉", msg: "Clarity arrives. Your energy opens doors that were closed yesterday." },
  { name: "The Empress", glyph: "♕", msg: "Nurture yourself first. What you plant in calm grows twice as strong." },
  { name: "The Moon", glyph: "☾", msg: "Trust your intuition over words. Someone is not showing their full face." },
  { name: "Strength", glyph: "∞", msg: "Your softness is your power. Stay gentle and the obstacle dissolves." },
];
const ORACLE = [
  "The guides see an old root beneath this. Tonight, write what you are ready to release on paper and burn it safely by a candle. The path opens after you let go.",
  "Yes — but a cord from your past is pulling against it. Speak their name once, then say: 'I release you with love.' Your heart will feel lighter within 3 days.",
  "A sign will come through a repeated number. When you see it, pause and make your wish out loud. The answer follows within the week.",
  "Someone close is drawing from your energy. For 7 mornings, imagine a golden light around you before you speak to anyone. Your strength returns.",
];
const FREQS = [
  { hz: 528, label: "Miracles & Renewal" },
  { hz: 639, label: "Love & Heart Healing" },
  { hz: 432, label: "Deep Sleep & Peace" },
];

/* ---------- sensory helpers ---------- */
let actx: AudioContext | null = null;
const ac = () => (actx ??= new AudioContext());
function chime(base = 880) {
  try {
    const c = ac();
    [1, 1.5, 2, 2.5].forEach((m, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = base * m;
      const t = c.currentTime + i * 0.07;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 1.7);
    });
  } catch { /* noop */ }
}
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* noop */ } };

/* Hold-to-channel: returns progress 0..1 and pointer handlers */
function useHold(ms: number, onDone: () => void) {
  const [p, setP] = useState(0);
  const raf = useRef(0), start = useRef(0), osc = useRef<{ o: OscillatorNode; g: GainNode } | null>(null);
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (osc.current) { try { osc.current.g.gain.value = 0; osc.current.o.stop(); } catch { /* noop */ } osc.current = null; }
  }, []);
  const down = () => {
    try {
      const c = ac(); const o = c.createOscillator(), g = c.createGain();
      o.type = "triangle"; o.frequency.value = 180; g.gain.value = 0.05; o.connect(g).connect(c.destination); o.start();
      osc.current = { o, g };
    } catch { /* noop */ }
    start.current = performance.now();
    let lastBuzz = 0;
    const tick = () => {
      const v = Math.min(1, (performance.now() - start.current) / ms);
      setP(v);
      if (osc.current) osc.current.o.frequency.value = 180 + v * 520;
      if (performance.now() - lastBuzz > 260 - v * 200) { buzz(10 + v * 30); lastBuzz = performance.now(); }
      if (v >= 1) { stop(); setP(0); buzz([40, 30, 120]); chime(); onDone(); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const up = () => { stop(); setP(0); };
  useEffect(() => stop, [stop]);
  return { p, handlers: { onPointerDown: down, onPointerUp: up, onPointerLeave: up, onPointerCancel: up, onContextMenu: (e: React.MouseEvent) => e.preventDefault() } };
}

function HoldButton({ label, ms = 2500, onDone }: { label: string; ms?: number; onDone: () => void }) {
  const { p, handlers } = useHold(ms, onDone);
  return (
    <button {...handlers} className="relative mx-auto mt-6 flex h-24 w-24 select-none items-center justify-center rounded-full border border-gold/50 bg-card touch-none" style={{ boxShadow: `0 0 ${10 + p * 60}px oklch(80% 0.125 82 / ${0.25 + p * 0.6})` }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="var(--gold)" strokeWidth="3" strokeDasharray={`${p * 289} 289`} strokeLinecap="round" /></svg>
      <span className="px-2 text-center text-[10px] uppercase leading-tight tracking-widest text-gold">{p > 0 ? `${Math.round(p * 100)}%` : label}</span>
    </button>
  );
}

function Burst({ k }: { k: number }) {
  if (!k) return null;
  return (
    <div key={k} className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2, r = 90 + (i % 4) * 30;
        return <span key={i} className="sx-burst" style={{ ["--dx" as string]: `${Math.cos(a) * r}px`, ["--dy" as string]: `${Math.sin(a) * r}px` }} />;
      })}
    </div>
  );
}

/* ---------- app shell ---------- */
type Tab = "altar" | "card" | "oracle" | "sound" | "vault";

function Sanctuary() {
  const [name, setName] = useState("Beloved");
  const [tab, setTab] = useState<Tab>("card");
  const [offer, setOffer] = useState<OfferKey | null>(null);
  const [streak, setStreak] = useState(1);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const n = sessionStorage.getItem("reader_name"); if (n) setName(n);
    const today = new Date().toDateString();
    const last = localStorage.getItem("sx_last"); let s = Number(localStorage.getItem("sx_streak") || "0");
    if (last !== today) { s = last === new Date(Date.now() - 864e5).toDateString() ? s + 1 : 1; localStorage.setItem("sx_streak", String(s)); localStorage.setItem("sx_last", today); }
    setStreak(Math.max(1, s));
    const t = setTimeout(() => { if (!sessionStorage.getItem("sx_toast")) { sessionStorage.setItem("sx_toast", "1"); setToast(true); } }, 45000);
    return () => clearTimeout(t);
  }, []);

  const tabs: [Tab, string, string][] = [["altar", "Altar", "🕯"], ["card", "Card", "✦"], ["oracle", "Oracle", "◉"], ["sound", "Sound", "∿"], ["vault", "Vault", "🔒"]];
  const vib = Math.min(99, 61 + streak * 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-28 text-foreground">
      <div className="sx-stars pointer-events-none fixed inset-0 opacity-70" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(55% 0.15 300 / .25), transparent 70%)" }} />

      {toast && (
        <button onClick={() => { setToast(false); setTab("altar"); }} className="sx-toast fixed inset-x-3 top-3 z-40 flex items-center gap-3 rounded-2xl border border-gold/40 bg-card/95 p-3 text-left shadow-gold backdrop-blur">
          <span className="text-2xl">🔔</span>
          <span className="text-xs"><b className="text-gold">The Reader</b> lit a gift candle for you today. Touch to see what it means.</span>
        </button>
      )}

      <header className="relative px-5 pt-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/60">Sacred Sanctuary</p>
        <h1 className="mt-1 font-display text-3xl text-gold">Welcome, {name}</h1>
        <div className="mx-auto mt-4 flex max-w-xs items-center gap-3 rounded-full border border-gold/25 bg-card/70 px-4 py-2 text-[11px]">
          <span>🔥 Day {streak}/7</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background"><div className="h-full bg-gold-gradient" style={{ width: `${vib}%` }} /></div>
          <span className="text-gold">{vib}%</span>
        </div>
      </header>

      <main className="relative mx-auto mt-6 max-w-md px-5">
        {tab === "altar" && <Altar name={name} onOffer={setOffer} />}
        {tab === "card" && <DailyCard name={name} onOffer={setOffer} />}
        {tab === "oracle" && <Oracle />}
        {tab === "sound" && <Frequencies onOffer={setOffer} />}
        {tab === "vault" && <Vault onOffer={setOffer} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-gold/20 bg-background/90 pb-4 pt-2 backdrop-blur">
        {tabs.map(([k, l, i]) => (
          <button key={k} onClick={() => { setTab(k); buzz(8); }} className={`flex flex-col items-center gap-0.5 px-2 text-[10px] transition ${tab === k ? "scale-110 text-gold" : "text-foreground/45"}`}>
            <span className="text-lg">{i}</span>{l}
          </button>
        ))}
      </nav>

      {offer && <OfferSheet k={offer} name={name} onClose={() => setOffer(null)} />}
    </div>
  );
}

/* ---------- offer sheet ---------- */
function OfferSheet({ k, name, onClose }: { k: OfferKey; name: string; onClose: () => void }) {
  const o = OFFERS[k];
  const [s, setS] = useState(600);
  useEffect(() => { chime(660); const t = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="sx-toast w-full rounded-t-3xl border-t border-gold/40 bg-card p-6 text-center shadow-gold">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gold/40" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Opened only for {name}</p>
        <h3 className="mt-2 font-display text-2xl text-gold">{o.title}</h3>
        <p className="mt-2 text-sm text-foreground/80">{o.desc}</p>
        <p className="mt-4"><span className="mr-2 text-foreground/40 line-through">{o.old}</span><span className="font-display text-4xl text-gold">{o.price}</span></p>
        <p className="mt-1 text-xs text-foreground/60">This portal closes in <b className="tabular-nums text-gold">{Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}</b></p>
        <a href={o.url} onClick={() => buzz(40)} className="sx-shimmer mt-5 block rounded-full bg-gold-gradient py-4 font-bold text-primary-foreground shadow-gold">UNLOCK NOW FOR {o.price}</a>
        <p className="mt-3 text-[11px] text-foreground/50">🔒 Instant access · 7-day energetic guarantee</p>
        <button onClick={onClose} className="mt-3 text-xs text-foreground/40 underline">Not now</button>
      </div>
    </div>
  );
}

function LockedSeal({ text, cta, onClick }: { text: ReactNode; cta: string; onClick: () => void }) {
  return (
    <div className="sx-toast mt-5 rounded-2xl border border-gold/30 bg-card p-4 text-left">
      <p className="text-sm text-foreground/90">{text}</p>
      <button onClick={onClick} className="sx-shimmer mt-3 w-full rounded-full bg-gold-gradient py-3 text-sm font-bold text-primary-foreground shadow-gold">{cta}</button>
    </div>
  );
}

/* ---------- card ---------- */
function DailyCard({ name, onOffer }: { name: string; onOffer: (k: OfferKey) => void }) {
  const [card, setCard] = useState<(typeof CARDS)[number] | null>(null);
  const [burst, setBurst] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reveal = () => { setCard(CARDS[Math.floor(Math.random() * CARDS.length)] ?? CARDS[0]!); setBurst(Date.now()); };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -22, y: ((e.clientX - r.left) / r.width - 0.5) * 22 });
  };
  const fx = 50 + tilt.y * 2.5;
  return (
    <section className="text-center">
      <h2 className="font-display text-xl text-gold">Your Golden Card of the Day</h2>
      <p className="mt-1 text-xs text-foreground/60">{card ? "Tilt the card to see its light" : "Hold the seal to channel your card"}</p>
      <div className="sx-scene relative mx-auto mt-6 h-80 w-52" onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
        <Burst k={burst} />
        <div className="sx-3d relative h-full w-full" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${(card ? 180 : 0) + tilt.y}deg)` }}>
          <div className="sx-face sx-cardback flex items-center justify-center">
            <span className="font-display text-6xl text-gold drop-shadow-[0_0_12px_var(--gold)]">✦</span>
            <div className="sx-foil" style={{ ["--fx" as string]: `${fx}%` }} />
          </div>
          <div className="sx-face sx-back sx-cardfront flex flex-col items-center justify-between p-5 text-primary-foreground">
            <span className="text-[10px] uppercase tracking-[0.3em]">For {name}</span>
            <span className="font-display text-7xl">{card?.glyph}</span>
            <span className="font-display text-xl">{card?.name}</span>
            <div className="sx-foil" style={{ ["--fx" as string]: `${100 - fx}%` }} />
          </div>
        </div>
      </div>
      {!card && <HoldButton label="Hold to channel" onDone={reveal} />}
      {card && (
        <>
          <p className="sx-toast mt-6 text-sm italic text-foreground/85">“{card.msg}”</p>
          <LockedSeal
            text={<>Want to go deeper, {name}? The Reader can do a full personal reading on what this card means for your love life.</>}
            cta="See my personal reading →" onClick={() => onOffer("emergency")} />
        </>
      )}
    </section>
  );
}

/* ---------- altar ---------- */
function Altar({ name, onOffer }: { name: string; onOffer: (k: OfferKey) => void }) {
  const [end] = useState(() => Date.now() + (6 * 24 + 14) * 3600e3);
  const [now, setNow] = useState(Date.now());
  const [lit, setLit] = useState(false);
  const [burst, setBurst] = useState(0);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (
    <section className="text-center">
      <div className="relative mx-auto h-80 w-full overflow-hidden rounded-3xl border border-gold/25" style={{ background: "radial-gradient(ellipse at 50% 85%, oklch(30% 0.06 60), oklch(12% 0.02 280) 70%)" }}>
        <div className={`sx-halo absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full transition-opacity ${lit ? "opacity-100" : "opacity-40"}`} />
        {[0, 1.5, 3, 4.5].map((dl) => <span key={dl} className="sx-smoke" style={{ left: `${44 + dl * 2}%`, bottom: "45%", animationDelay: `${dl}s` }} />)}
        <Burst k={burst} />
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <div className="sx-flame" style={{ transform: lit ? "scale(1.5)" : undefined }} />
          <div className="h-2 w-0.5 bg-foreground/80" />
          <div className="sx-wax h-36 w-16" />
          <div className="h-3 w-28 rounded-[50%] bg-gold-gradient opacity-80" />
        </div>
        <div className="absolute bottom-0 h-10 w-full" style={{ background: "linear-gradient(transparent, oklch(10% 0.02 60))" }} />
      </div>
      <p className="mt-4 font-display text-xl text-gold">{name}'s sacred flame is active</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{d}d {h}h {m}m {sec}s</p>
      <p className="text-xs text-foreground/60">of protection remaining</p>
      {!lit ? <HoldButton label="Hold to feed the flame" onDone={() => { setLit(true); setBurst(Date.now()); }} /> : (
        <LockedSeal text={<>Your flame grew stronger, {name}. Come back tomorrow to keep it burning. If you'd like, the Reader can also light a real 21-day candle for you on her altar.</>}
          cta="Learn about the 21-day candle →" onClick={() => onOffer("candle")} />
      )}
    </section>
  );
}

/* ---------- oracle ---------- */
function Oracle() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!a) return; setTyped(""); let i = 0;
    const t = setInterval(() => { i++; setTyped(a.slice(0, i)); if (i % 3 === 0) buzz(4); if (i >= a.length) clearInterval(t); }, 35);
    return () => clearInterval(t);
  }, [a]);
  return (
    <section className="text-center">
      <h2 className="font-display text-xl text-gold">The Crystal Oracle</h2>
      <div className="sx-scene relative mx-auto mt-6 h-56 w-56">
        <div className="sx-orb absolute inset-0 overflow-hidden rounded-full"><div className="sx-mist absolute inset-4 rounded-full" /></div>
        <div className="sx-ring absolute -inset-4" />
        <div className="absolute -bottom-6 left-1/2 h-8 w-32 -translate-x-1/2 rounded-[50%] bg-gold-gradient opacity-70 blur-[1px]" />
      </div>
      <textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask the crystal what your heart needs to know…" className="mt-10 h-20 w-full rounded-2xl border border-gold/30 bg-card p-3 text-sm" />
      {q.trim() && !a && <HoldButton label="Hold to gaze" onDone={() => setA(ORACLE[Math.floor(Math.random() * ORACLE.length)] ?? "")} />}
      {a && (
        <>
          <p className="mt-5 min-h-12 text-sm italic text-foreground/90">“{typed}”</p>
          <button onClick={() => { setA(""); setQ(""); }} className="mt-3 text-xs text-foreground/50 underline">Ask another question</button>
        </>
      )}
    </section>
  );
}

/* ---------- frequencies ---------- */
function Frequencies({ onOffer }: { onOffer: (k: OfferKey) => void }) {
  const nodes = useRef<OscillatorNode[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const stop = () => { nodes.current.forEach((o) => { try { o.stop(); } catch { /* noop */ } }); nodes.current = []; setPlaying(null); };
  const play = (hz: number) => {
    stop(); const c = ac();
    const g = c.createGain(); g.gain.value = 0.07; g.connect(c.destination);
    [hz, hz + 6].forEach((f, i) => { const o = c.createOscillator(); o.frequency.value = f; const p = c.createStereoPanner(); p.pan.value = i ? 1 : -1; o.connect(p).connect(g); o.start(); nodes.current.push(o); });
    setPlaying(hz); buzz(15);
  };
  useEffect(() => stop, []);
  return (
    <section className="space-y-3 text-center">
      <h2 className="font-display text-xl text-gold">Sacred Frequencies</h2>
      <p className="text-xs text-foreground/60">Use headphones for the full binaural effect</p>
      <div className="relative mx-auto my-6 flex h-40 w-40 items-center justify-center">
        {[0, 1, 2].map((i) => <span key={i} className={`absolute inset-0 rounded-full border border-gold/50 ${playing ? "animate-ping" : ""}`} style={{ animationDelay: `${i * 0.6}s`, animationDuration: "2s" }} />)}
        <span className="font-display text-3xl text-gold">{playing ? `${playing}Hz` : "∿"}</span>
      </div>
      {FREQS.map((f) => (
        <button key={f.hz} onClick={() => (playing === f.hz ? stop() : play(f.hz))} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${playing === f.hz ? "border-gold bg-gold/10 shadow-gold-soft" : "border-gold/25 bg-card"}`}>
          <span><span className="font-display text-lg text-gold">{f.hz} Hz</span><br /><span className="text-sm text-foreground/70">{f.label}</span></span>
          <span className="text-gold">{playing === f.hz ? "❚❚" : "▶"}</span>
        </button>
      ))}
      <button onClick={() => onOffer("moon")} className="flex w-full items-center justify-between rounded-2xl border border-gold/25 bg-card/50 p-4 text-left opacity-80">
        <span><span className="font-display text-lg text-gold">🔒 Full Moon Activation</span><br /><span className="text-sm text-foreground/70">Moon Circle members only</span></span>
        <span className="text-xs text-gold">Unlock</span>
      </button>
    </section>
  );
}

/* ---------- vault ---------- */
function Vault({ onOffer }: { onOffer: (k: OfferKey) => void }) {
  const owned = ["Your 5 Revelations Dossier", "Soulmate Map & Karmic Cleansing", "The 27-Year Vault Grimoire", "7-Day Altar Shield Prayers"];
  const locked: OfferKey[] = ["emergency", "synastry", "candle", "moon"];
  return (
    <section className="space-y-3">
      <h2 className="text-center font-display text-xl text-gold">Your Grimoire</h2>
      {owned.map((t) => (
        <div key={t} className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-card p-4">
          <span className="text-xl">📜</span><div><p className="font-display text-gold">{t}</p><p className="text-[11px] text-foreground/60">Unlocked</p></div>
        </div>
      ))}
      <h2 className="pt-6 text-center font-display text-xl text-gold">Go Deeper (optional)</h2>
      {locked.map((k) => {
        const o = OFFERS[k];
        return (
          <button key={k} onClick={() => onOffer(k)} className="sx-shimmer block w-full rounded-2xl border border-gold/40 bg-card p-4 text-left">
            <p className="font-display text-gold">🔒 {o.title}</p>
            <p className="mt-1 text-sm text-foreground/70">{o.desc}</p>
            <p className="mt-2 text-sm"><span className="mr-2 text-foreground/40 line-through">{o.old}</span><b className="text-gold">{o.price}</b></p>
          </button>
        );
      })}
    </section>
  );
}
