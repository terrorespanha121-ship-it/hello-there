import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRandom(42);
const STARS = Array.from({ length: 110 }, () => ({
  x: rng() * 100,
  y: rng() * 100,
  size: rng() < 0.88 ? 1 + rng() * 1.2 : 2 + rng() * 1.5,
  dur: 3 + rng() * 5,
  delay: rng() * 5,
}));

const MOON_LOGO_URL = "/images/moon-logo.jpg";

interface CosmicShellProps {
  children: ReactNode;
  widthClassName?: string;
}

export function CosmicShell({ children, widthClassName = "max-w-[768px]" }: CosmicShellProps) {
  const [cookieOpen, setCookieOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmos">
      {/* Background Starfield */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        {STARS.map((star, idx) => (
          <span
            key={idx}
            className="star-dot absolute rounded-full bg-star"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                "--tw-dur": `${star.dur}s`,
                "--tw-delay": `${star.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Main Container */}
      <main className={`relative z-10 mx-auto flex w-full flex-col items-center px-5 pb-16 ${widthClassName}`}>
        <img
          src={MOON_LOGO_URL}
          alt="Moon"
          width={52}
          height={62}
          className="mt-5 h-[62px] w-[52px] mix-blend-screen [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
        />

        {children}

        {/* Footer */}
        <footer className="mt-16 flex gap-5 text-xs text-foreground/40">
          <Link to="/privacy" className="hover:text-gold">
            Privacy policy
          </Link>
          <button type="button" onClick={() => setCookieOpen(true)} className="hover:text-gold cursor-pointer">
            Cookie settings
          </button>
        </footer>
      </main>

      {/* Cookie Settings Dialog */}
      {cookieOpen && (
        <div
          role="dialog"
          aria-label="Cookie settings"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[640px] border border-gold/60 bg-panel px-5 py-5 text-foreground shadow-gold-soft backdrop-blur sm:px-7"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-gold">Your privacy</p>
            <button
              type="button"
              onClick={() => setCookieOpen(false)}
              className="text-foreground/50 hover:text-foreground cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            We do not use advertising pixels or tracking tags on this site.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setCookieOpen(false)}
              className="bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => setCookieOpen(false)}
              className="border border-gold/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground/80 hover:bg-gold/10 cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoldButton({
  children,
  onClick,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-16 w-full max-w-[448px] text-[15px] font-medium uppercase tracking-[0.04em] text-primary-foreground shadow-cta transition-transform hover:scale-[1.015] cursor-pointer ${
        reverse ? "bg-gold-gradient-reverse" : "bg-gold-gradient"
      } ${className}`}
    >
      {children}
    </button>
  );
}
