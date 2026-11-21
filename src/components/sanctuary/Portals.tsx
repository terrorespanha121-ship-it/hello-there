import { useEffect, useState } from "react";
import type { Product } from "@/lib/entitlements";

const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* noop */ } };

// Placeholder Whop links — swap for real ones.
export const PORTALS: Record<Product, { title: string; sub: string; icon: string; pdf: string; price: string; url: string; teaser: string }> = {
  front: { title: "The Sacred Golden Scroll", sub: "Past · Present · Destiny", icon: "📜", pdf: "/downloads/sacred-golden-scroll.pdf", price: "", url: "", teaser: "" },
  love: { title: "The Sacred Flame", sub: "Love & Twin Flames", icon: "❤️‍🔥", pdf: "/downloads/sacred-flame-love-reading.pdf", price: "$27", url: "#whop-love", teaser: "The Soulmate Mirror test, the cord-cutting ceremony and your 3 love cards." },
  prosperity: { title: "Vault of Abundance 2027", sub: "The 5 Secret Seals", icon: "🗝", pdf: "/downloads/vault-of-abundance-2027.pdf", price: "$97", url: "#whop-prosperity", teaser: "Open the 5 sealed doors and your 2027 luck calendar." },
  shield: { title: "The Sacred Shield", sub: "7-Day Protection Ritual", icon: "🛡", pdf: "/downloads/sacred-shield-7-day-ritual.pdf", price: "$37", url: "#whop-shield", teaser: "Light one candle a day for 7 days and seal your energy." },
};

function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s) as T); } catch { /* noop */ } }, [key]);
  const set = (n: T) => { setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set] as const;
}

const Card = ({ children }: { children: React.ReactNode }) => <div className="sx-toast mt-4 rounded-2xl border border-gold/30 bg-card p-4">{children}</div>;
const Pdf = ({ p }: { p: Product }) => <a href={PORTALS[p].pdf} download className="mt-5 block rounded-full border border-gold/50 py-3 text-center text-sm text-gold">⬇ Save my eBook again</a>;

/* FRONT: 3-card spread + 90-day path */
const SPREAD = [
  { pos: "Past", name: "The Tower", msg: "What broke was never meant to hold you. The wound became your foundation." },
  { pos: "Present", name: "The Star", msg: "You are healing faster than you believe. Keep your hope visible." },
  { pos: "Destiny", name: "The Sun", msg: "A season of clarity and warmth is forming around your name." },
];
const PHASES = ["Days 1–30 · Release", "Days 31–60 · Attract", "Days 61–90 · Receive"];
function Front({ name }: { name: string }) {
  const [open, setOpen] = useStored<number[]>("sx_spread", []);
  const [week, setWeek] = useStored<number>("sx_week", 0);
  return (
    <>
      <p className="text-center text-xs text-foreground/60">Touch each card, {name}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SPREAD.map((c, i) => {
          const o = open.includes(i);
          return (
            <button key={c.pos} onClick={() => { if (!o) { setOpen([...open, i]); buzz([20, 30, 60]); } }} className="sx-scene h-40">
              <div className="sx-3d relative h-full w-full" style={{ transform: `rotateY(${o ? 180 : 0}deg)` }}>
                <div className="sx-face sx-cardback flex items-center justify-center text-3xl text-gold">✦</div>
                <div className="sx-face sx-back sx-cardfront flex flex-col items-center justify-center p-2 text-primary-foreground">
                  <span className="text-[9px] uppercase tracking-widest">{c.pos}</span><span className="mt-2 font-display text-sm">{c.name}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {open.map((i) => <Card key={i}><b className="font-display text-gold">{SPREAD[i]?.pos}:</b> <span className="text-sm">{SPREAD[i]?.msg}</span></Card>)}
      <h3 className="mt-8 text-center font-display text-lg text-gold">Your 90-Day Path</h3>
      <p className="text-center text-xs text-foreground/60">Week {week}/13 completed</p>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <button key={i} onClick={() => { setWeek(i + 1); buzz(15); }} className={`aspect-square rounded-full border text-[10px] ${i < week ? "border-gold bg-gold-gradient text-primary-foreground" : "border-gold/30 text-foreground/50"}`}>{i + 1}</button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-gold">{PHASES[Math.min(2, Math.floor(week / 4.4))]}</p>
    </>
  );
}

/* LOVE: soulmate mirror + cord cutting */
const SIGNS = ["You felt you knew them before you met", "Time disappears when you are together", "You dream of them often", "Repeating numbers appear when you think of them", "They push you to grow, not shrink", "Silence with them feels peaceful", "Distance never fully breaks the bond"];
function Love({ name }: { name: string }) {
  const [yes, setYes] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [burn, setBurn] = useState(0);
  const pct = Math.round((yes.length / 7) * 100);
  return (
    <>
      <h3 className="text-center font-display text-lg text-gold">The Soulmate Mirror</h3>
      {SIGNS.map((s, i) => (
        <button key={s} onClick={() => { setYes(yes.includes(i) ? yes.filter((x) => x !== i) : [...yes, i]); buzz(10); }} className={`mt-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm ${yes.includes(i) ? "border-gold bg-gold/10" : "border-gold/20 bg-card"}`}>
          <span className="text-gold">{yes.includes(i) ? "♥" : "○"}</span>{s}
        </button>
      ))}
      {!done ? <button onClick={() => { setDone(true); buzz([30, 40, 90]); }} className="sx-shimmer mt-4 w-full rounded-full bg-gold-gradient py-3 font-bold text-primary-foreground">Reveal the bond</button> : (
        <Card><p className="text-center font-display text-4xl text-gold">{pct}%</p><p className="mt-1 text-center text-sm">{pct >= 70 ? `${name}, this has the marks of a soulmate bond.` : pct >= 40 ? "A karmic lesson with real love inside it." : "A passing teacher. Your true flame is still on its way."}</p></Card>
      )}
      <h3 className="mt-8 text-center font-display text-lg text-gold">Cord-Cutting Ceremony</h3>
      <p className="text-center text-xs text-foreground/60">Tap the cord 7 times to release an old bond</p>
      <button onClick={() => { if (burn < 7) { setBurn(burn + 1); buzz(20 + burn * 10); } }} className="relative mx-auto mt-4 block h-16 w-full">
        <span className="absolute inset-x-6 top-1/2 h-1 rounded bg-gold-gradient transition-all" style={{ opacity: 1 - burn / 7, transform: `scaleX(${1 - burn / 7})` }} />
        <span className="relative font-display text-gold">{burn < 7 ? `🔥 ${burn}/7` : "✦ Released"}</span>
      </button>
      {burn >= 7 && <Card><p className="text-sm italic">“I release you with love. What is mine finds me freely.” Say it aloud once tonight.</p></Card>}
    </>
  );
}

/* PROSPERITY: 5 seals, one per day */
const SEALS = ["Seal of Release — let go of old money fears", "Seal of Flow — welcome the unexpected", "Seal of Value — name what you truly offer", "Seal of Multiplication — plant one small seed daily", "Seal of Gratitude — thank what already arrived"];
const MONTHS = ["Mar 2027 · new beginnings", "Jun 2027 · open doors", "Sep 2027 · harvest", "Dec 2027 · completion"];
function Prosperity() {
  const [opened, setOpened] = useStored<number>("sx_seals", 0);
  return (
    <>
      <h3 className="text-center font-display text-lg text-gold">The 5 Secret Seals</h3>
      <div className="mt-4 flex justify-center gap-2">
        {SEALS.map((_, i) => (
          <button key={i} disabled={i !== opened} onClick={() => { setOpened(i + 1); buzz([20, 40, 80]); }} className={`h-14 w-14 rounded-full border-2 font-display text-lg transition ${i < opened ? "border-gold bg-gold-gradient text-primary-foreground" : i === opened ? "sx-shimmer animate-pulse border-gold text-gold" : "border-gold/20 text-foreground/30"}`}>{i < opened ? "✦" : i + 1}</button>
        ))}
      </div>
      {SEALS.slice(0, opened).map((s) => <Card key={s}><p className="text-sm">{s}</p></Card>)}
      <h3 className="mt-8 text-center font-display text-lg text-gold">Your 2027 Luck Calendar</h3>
      {MONTHS.map((m) => <div key={m} className="mt-2 rounded-xl border border-gold/20 bg-card p-3 text-sm">🌕 {m}</div>)}
    </>
  );
}

/* SHIELD: 7-day candle tracker */
function Shield({ name }: { name: string }) {
  const [days, setDays] = useStored<string[]>("sx_shield", []);
  const today = new Date().toDateString();
  const litToday = days.includes(today);
  return (
    <>
      <h3 className="text-center font-display text-lg text-gold">7-Day Protection Candles</h3>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className={`text-2xl transition ${i < days.length ? "drop-shadow-[0_0_10px_var(--gold)]" : "opacity-25 grayscale"}`}>🕯</span>
            <span className="text-[10px] text-foreground/60">Day {i + 1}</span>
          </div>
        ))}
      </div>
      {days.length >= 7 ? <Card><p className="text-center text-sm">Your shield is sealed, {name}. Repeat the words whenever you feel heavy.</p></Card> :
        <button disabled={litToday} onClick={() => { setDays([...days, today]); buzz([30, 30, 120]); }} className="sx-shimmer mt-5 w-full rounded-full bg-gold-gradient py-3 font-bold text-primary-foreground disabled:opacity-50">{litToday ? "Come back tomorrow for the next candle" : `Light candle ${days.length + 1}`}</button>}
      <Card><p className="text-sm italic">“Golden light around me, nothing heavy enters. I keep what is mine and return what is not.”</p></Card>
    </>
  );
}

export function PortalBody({ p, name }: { p: Product; name: string }) {
  return (
    <section>
      <p className="text-center text-3xl">{PORTALS[p].icon}</p>
      <h2 className="text-center font-display text-2xl text-gold">{PORTALS[p].title}</h2>
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-foreground/60">{PORTALS[p].sub}</p>
      {p === "front" && <Front name={name} />}
      {p === "love" && <Love name={name} />}
      {p === "prosperity" && <Prosperity />}
      {p === "shield" && <Shield name={name} />}
      <Pdf p={p} />
    </section>
  );
}
