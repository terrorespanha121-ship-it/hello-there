import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Your Sacred Sanctuary" },
      { name: "description", content: "Your living altar, daily golden card, sacred frequencies and rituals." },
      { property: "og:title", content: "Your Sacred Sanctuary" },
      { property: "og:description", content: "Your living altar, daily golden card, sacred frequencies and rituals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Sanctuary,
});

const CARDS = [
  { name: "The Star", msg: "Hope returns to you. Something you thought was lost is quietly finding its way back." },
  { name: "The Lovers", msg: "A choice of the heart is near. Follow what makes your chest feel warm, not heavy." },
  { name: "Wheel of Fortune", msg: "The cycle turns in your favour. Say yes to the unexpected invitation this week." },
  { name: "The Sun", msg: "Clarity arrives. Today your energy opens doors that were closed yesterday." },
  { name: "The Empress", msg: "Nurture yourself first. What you plant in calm grows twice as strong." },
  { name: "The Moon", msg: "Trust your intuition over words. Someone is not showing their full face." },
  { name: "Strength", msg: "Your softness is your power. Stay gentle and the obstacle dissolves." },
];

const FREQS = [
  { hz: 528, label: "Miracles & Abundance" },
  { hz: 639, label: "Love & Heart Healing" },
  { hz: 432, label: "Deep Sleep & Peace" },
];

const LIBRARY = [
  { title: "Your 5 Revelations Dossier", owned: true },
  { title: "Soulmate Map & Karmic Cleansing", owned: true },
  { title: "The 27-Year Vault Grimoire", owned: true },
  { title: "7-Day Altar Shield Prayers", owned: true },
];

const LOCKED = [
  { title: "Emergency Oracle — 3 Direct Questions", price: "$27", desc: "Deep Celtic Cross reading for the question burning in you now." },
  { title: "Love Synastry Map", price: "$29", desc: "Your birth date + theirs: soulmate or past-life lesson?" },
  { title: "Moon Circle Club", price: "$14.90/mo", desc: "New & Full Moon rituals every 15 days." },
  { title: "21-Day Acceleration Candle", price: "$67", desc: "The reader consecrates a 21-day intention candle on her altar." },
];

const ORACLE = [
  "The guides say: wait three days before you answer. Clarity comes with patience.",
  "Yes — but only if you release the fear you carry from the past.",
  "A sign will come through a number you see repeated. Pay attention.",
  "Protect your energy this week. Not everyone around you wishes you well.",
];

function Sanctuary() {
  const [name, setName] = useState("Beloved");
  const [tab, setTab] = useState<"altar" | "card" | "sound" | "library" | "oracle">("altar");
  useEffect(() => {
    const n = sessionStorage.getItem("reader_name");
    if (n) setName(n);
  }, []);

  const tabs = [
    ["altar", "Altar"], ["card", "Daily Card"], ["sound", "Frequencies"], ["library", "Grimoire"], ["oracle", "Oracle"],
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <header className="px-5 pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Sacred Sanctuary</p>
        <h1 className="mt-2 font-display text-3xl text-gold">Welcome, {name}</h1>
      </header>
      <main className="mx-auto mt-6 max-w-md px-5">
        {tab === "altar" && <Altar name={name} />}
        {tab === "card" && <DailyCard />}
        {tab === "sound" && <Frequencies />}
        {tab === "library" && <Library />}
        {tab === "oracle" && <Oracle />}
        <Locked />
      </main>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-gold/20 bg-background/95 py-3 backdrop-blur">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`text-xs ${tab === k ? "text-gold" : "text-foreground/50"}`}>{l}</button>
        ))}
      </nav>
    </div>
  );
}

function Altar({ name }: { name: string }) {
  const [end] = useState(() => Date.now() + (6 * 24 + 14) * 3600e3);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (
    <section className="rounded-2xl border border-gold/30 bg-card p-6 text-center">
      <div className="mx-auto flex h-40 w-16 flex-col items-center justify-end">
        <div className="h-8 w-5 animate-pulse rounded-full bg-gold shadow-[0_0_40px_10px] shadow-gold/50" />
        <div className="mt-1 h-24 w-10 rounded-t-md bg-gold-soft/80" />
      </div>
      <p className="mt-4 font-display text-xl text-gold">{name}'s sacred flame is active</p>
      <p className="mt-2 text-sm text-foreground/70">Continuous protection remaining</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{d}d {h}h {m}m {sec}s</p>
    </section>
  );
}

function DailyCard() {
  const [card, setCard] = useState<(typeof CARDS)[number] | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const draw = () => {
    setShuffling(true); setCard(null);
    setTimeout(() => { setCard(CARDS[Math.floor(Math.random() * CARDS.length)] ?? CARDS[0]!); setShuffling(false); }, 1400);
  };
  return (
    <section className="rounded-2xl border border-gold/30 bg-card p-6 text-center">
      <h2 className="font-display text-xl text-gold">Your Golden Card of the Day</h2>
      <div className={`mx-auto mt-5 flex h-56 w-36 items-center justify-center rounded-xl border-2 border-gold bg-background p-3 transition-transform duration-700 ${shuffling ? "animate-pulse rotate-6" : ""}`}>
        {card ? <span className="font-display text-lg text-gold">{card.name}</span> : <span className="text-3xl text-gold">✦</span>}
      </div>
      {card && <p className="mt-4 text-sm text-foreground/80">{card.msg}</p>}
      <button onClick={draw} disabled={shuffling} className="mt-5 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
        {shuffling ? "Shuffling..." : card ? "Draw again" : "Touch to shuffle"}
      </button>
    </section>
  );
}

function Frequencies() {
  const ctx = useRef<AudioContext | null>(null);
  const nodes = useRef<OscillatorNode[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const stop = () => { nodes.current.forEach((o) => o.stop()); nodes.current = []; setPlaying(null); };
  const play = (hz: number) => {
    stop();
    const c = ctx.current ?? new AudioContext(); ctx.current = c;
    const gain = c.createGain(); gain.gain.value = 0.08; gain.connect(c.destination);
    [hz, hz + 6].forEach((f, i) => {
      const o = c.createOscillator(); o.frequency.value = f;
      const p = c.createStereoPanner(); p.pan.value = i ? 1 : -1;
      o.connect(p).connect(gain); o.start(); nodes.current.push(o);
    });
    setPlaying(hz);
  };
  useEffect(() => stop, []);
  return (
    <section className="space-y-3">
      <h2 className="text-center font-display text-xl text-gold">Sacred Frequencies</h2>
      <p className="text-center text-xs text-foreground/60">Use headphones for the full binaural effect</p>
      {FREQS.map((f) => (
        <button key={f.hz} onClick={() => (playing === f.hz ? stop() : play(f.hz))} className="flex w-full items-center justify-between rounded-xl border border-gold/30 bg-card p-4">
          <span><span className="font-display text-lg text-gold">{f.hz} Hz</span><br /><span className="text-sm text-foreground/70">{f.label}</span></span>
          <span className="text-gold">{playing === f.hz ? "❚❚" : "▶"}</span>
        </button>
      ))}
    </section>
  );
}

function Library() {
  return (
    <section className="space-y-3">
      <h2 className="text-center font-display text-xl text-gold">Your Grimoire</h2>
      {LIBRARY.map((b) => (
        <div key={b.title} className="rounded-xl border border-gold/30 bg-card p-4">
          <p className="font-display text-gold">{b.title}</p>
          <p className="text-xs text-foreground/60">Unlocked · opening soon</p>
        </div>
      ))}
    </section>
  );
}

function Oracle() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  return (
    <section className="rounded-2xl border border-gold/30 bg-card p-6">
      <h2 className="text-center font-display text-xl text-gold">Ask the Oracle</h2>
      <textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do the guides say about..." className="mt-4 h-24 w-full rounded-lg border border-gold/30 bg-background p-3 text-sm" />
      <button disabled={!q.trim()} onClick={() => setA(ORACLE[Math.floor(Math.random() * ORACLE.length)] ?? "")} className="mt-3 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">Channel answer</button>
      {a && <p className="mt-4 text-center text-sm italic text-foreground/85">“{a}”</p>}
    </section>
  );
}

function Locked() {
  return (
    <section className="mt-10 space-y-3">
      <h2 className="text-center font-display text-xl text-gold">Sealed Portals</h2>
      {LOCKED.map((l) => (
        <div key={l.title} className="relative overflow-hidden rounded-xl border border-gold/20 bg-card/60 p-4">
          <p className="font-display text-gold">🔒 {l.title}</p>
          <p className="mt-1 text-sm text-foreground/70">{l.desc}</p>
          <button onClick={() => alert("Checkout link coming soon")} className="mt-3 rounded-full border border-gold px-4 py-2 text-sm text-gold">Unlock for {l.price}</button>
        </div>
      ))}
    </section>
  );
}
