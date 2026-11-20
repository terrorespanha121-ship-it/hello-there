import { useEffect, useRef, useState } from "react";

type Props = { onReveal: () => void; children: React.ReactNode };

/** Gold scratch-off layer over hidden content. Reveals once ~55% is scratched. */
export function ScratchCard({ onReveal, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#8a6a2f");
    g.addColorStop(0.5, "#e8c977");
    g.addColorStop(1, "#8a6a2f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(40,25,5,0.85)";
    ctx.font = "600 16px serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", r.width / 2, r.height / 2);
    ctx.font = "12px serif";
    ctx.fillText("your secret gift from the cards", r.width / 2, r.height / 2 + 22);
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || done) return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();
  };

  const check = () => {
    drawing.current = false;
    const c = canvasRef.current;
    if (!c || done) return;
    const data = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    if (clear / (data.length / 64) > 0.55) {
      setDone(true);
      onReveal();
    }
  };

  return (
    <div className="relative mx-auto aspect-[3/4] w-56 overflow-hidden rounded-lg border-2 border-gold/60 shadow-cta">
      {children}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : "opacity-100"}`}
        onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }}
        onPointerMove={scratch}
        onPointerUp={check}
        onPointerCancel={check}
      />
    </div>
  );
}
