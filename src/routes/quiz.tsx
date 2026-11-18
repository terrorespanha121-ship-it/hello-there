import { useState, useEffect, useRef, Fragment } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CosmicShell, GoldButton } from "../components/CosmicShell";
import vslQ1 from "@/assets/vsl-q1.mp4.asset.json";
import vslQ2 from "@/assets/vsl-q2.mp4.asset.json";
import vslQ3 from "@/assets/vsl-q3.mp4.asset.json";
import vslQ4 from "@/assets/vsl-q4.mp4.asset.json";
import vslQ5 from "@/assets/vsl-q5.mp4.asset.json";
import ambientMusic from "@/assets/ambient_acoustic.mp3.asset.json";

const VSL_VIDEOS = [vslQ1.url, vslQ2.url, vslQ3.url, vslQ4.url, vslQ5.url];

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Your Free Tarot Reading — A Few Questions First" },
      {
        name: "description",
        content: "Answer 5 quick questions so the cards can tune into your current energy.",
      },
    ],
  }),
  component: QuizPage,
});

interface Question {
  kicker?: string;
  lead?: string;
  title: [string, boolean?][];
  options: { emoji?: string; text: string }[];
}

const QUESTIONS: Question[] = [
  {
    title: [
      ["Which of these sentences feels\nlike it was "],
      ["written about you", true],
      ["?"],
    ],
    options: [
      { emoji: "😮‍💨", text: "My life feels stuck, even though I'm doing everything right." },
      { emoji: "😔", text: "I have everything to be happy, yet I still feel empty inside." },
      { emoji: "🫥", text: "I'm facing an important decision and I don't know which path to take." },
      { emoji: "😯", text: "I feel something big is about to change, but I don't know what." },
    ],
  },
  {
    title: [
      ["When you think about "],
      ["your relationships", true],
      ["...\nwhich sentence describes what you feel best?"],
    ],
    options: [
      { emoji: "💔", text: "I give everything to people, but when I need someone... I'm alone." },
      { emoji: "😥", text: "I feel like I carry it all while everyone else moves forward." },
      { emoji: "😢", text: "I've given so much of myself that I no longer know what's left for me." },
      { emoji: "🥺", text: "I feel my love, my effort and my energy are never enough." },
    ],
  },
  {
    title: [
      ["If 2026 could bring "],
      ["one real\ntransformation", true],
      [" into your life,\nwhich would mean the most to you?"],
    ],
    options: [
      { text: "Finally escaping financial pressure and building real stability" },
      { text: "Meeting the right person for me — a love that truly lasts" },
      { text: "Waking up at peace with myself, without the constant noise in my head" },
      { text: "Discovering my purpose — where I belong and what I came here to do" },
    ],
  },
  {
    title: [
      [
        "Has this happened to you? You look around\nand everyone seems to be moving forward...\nwhile you feel ",
      ],
      ["stuck in the same place", true],
      ["."],
    ],
    options: [
      { text: "Yes — that describes exactly where I am right now" },
      { text: "Sometimes, but I tell myself it's just a rough phase" },
      { text: "I feel it, but I can't explain why" },
    ],
  },
  {
    kicker: "(Last question before your reading)",
    lead: "If the cards revealed TODAY what is blocking your life and showed you the exact path to unlock it...",
    title: [["Would you be ready to follow that guidance?"]],
    options: [
      { emoji: "✅", text: "Yes, I'm ready to receive it." },
      { emoji: "😔", text: "Yes, but I'm afraid of being let down again." },
      { emoji: "🤔", text: "I don't know, it depends on what the cards say." },
    ],
  },
];

const CARD_BACK = "/images/card-back.jpg";
const CARD_WHEEL = "/images/card-wheel.jpg";
const CARD_FOOL = "/images/card-fool.jpg";
const CARD_TOWER = "/images/card-tower.jpg";

const REVEALED_CARDS = ["The Wheel of Fortune", "The Fool", "The Tower"];
const CARD_IMAGES: Record<string, string> = {
  "The Wheel of Fortune": CARD_WHEEL,
  "The Fool": CARD_FOOL,
  "The Tower": CARD_TOWER,
};

type QuizStep =
  | { kind: "question"; index: number }
  | { kind: "loading" }
  | { kind: "intro" }
  | { kind: "deck" };

function calculateProgress(index: number) {
  return Math.round(((index + 1) / 7) * 100);
}

function QuizPage() {
  const [step, setStep] = useState<QuizStep>({ kind: "question", index: 0 });
  const [fading, setFading] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = () => {
    if (!musicRef.current) {
      const a = new Audio(ambientMusic.url);
      a.loop = true;
      a.volume = 0.12;
      musicRef.current = a;
    }
    musicRef.current.play().catch(() => {});
  };

  useEffect(() => () => musicRef.current?.pause(), []);

  const transitionTo = (nextStep: QuizStep) => {
    setFading(true);
    setTimeout(() => {
      setStep(nextStep);
      setFading(false);
      window.scrollTo({ top: 0 });
    }, 350);
  };

  const stepKey = step.kind === "question" ? `q${step.index}` : step.kind;

  return (
    <CosmicShell>
      <div className={`flex w-full flex-col items-center ${fading ? "fade-out" : ""}`}>
        {step.kind === "question" && (
          <QuestionStep
            key={stepKey}
            index={step.index}
            question={QUESTIONS[step.index]}
            onStart={startMusic}
            onAnswer={() =>
              transitionTo(
                step.index + 1 < QUESTIONS.length
                  ? { kind: "question", index: step.index + 1 }
                  : { kind: "loading" }
              )
            }
          />
        )}

        {step.kind === "loading" && (
          <LoadingStep
            key={stepKey}
            onDone={() => transitionTo({ kind: "intro" })}
          />
        )}

        {step.kind === "intro" && (
          <IntroStep
            key={stepKey}
            onContinue={() => transitionTo({ kind: "deck" })}
          />
        )}

        {step.kind === "deck" && <DeckStep key={stepKey} />}
      </div>
    </CosmicShell>
  );
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`w-full max-w-[632px] ${className}`}>
      <div className="mb-2 text-right font-display text-xl text-gold">{value}%</div>
      <div className="relative h-px w-full bg-foreground/15">
        <div
          className="absolute inset-y-0 left-0 bg-gold shadow-[0_0_8px_var(--gold)] transition-[width] duration-700 ease-out"
          style={{ width: `${value}%`, height: 2, top: -0.5 }}
        />
      </div>
    </div>
  );
}

function HighlightedTitle({ parts }: { parts: [string, boolean?][] }) {
  return (
    <Fragment>
      {parts.map(([text, isGold], i) =>
        isGold ? (
          <span key={i} className="text-gold">
            {text}
          </span>
        ) : (
          <span key={i}>{text}</span>
        )
      )}
    </Fragment>
  );
}

function QuestionStep({
  index,
  question,
  onAnswer,
  onStart,
}: {
  index: number;
  question: Question;
  onAnswer: () => void;
  onStart: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(index > 0);
  const [showOptions, setShowOptions] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !started) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [started]);

  const handleClick = (optIndex: number) => {
    if (selected === null) {
      setSelected(optIndex);
      setTimeout(onAnswer, 650);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <Fragment>
      <ProgressBar value={calculateProgress(index)} className="mt-12" />

      <div className="fade-in flex w-full flex-col items-center">
        <div className="relative mt-10 w-full max-w-[448px] overflow-hidden border border-gold/20 p-1.5 shadow-option">
          <video
            ref={videoRef}
            src={VSL_VIDEOS[index]}
            poster="/images/reader-portrait.jpg"
            playsInline
            preload="auto"
            onEnded={() => setShowOptions(true)}
            className="block aspect-[651/682] h-auto w-full object-cover"
          />
          {!started && (
            <button
              type="button"
              onClick={() => {
                setStarted(true);
                onStart();
              }}
              className="absolute inset-1.5 flex flex-col items-center justify-center gap-3 bg-background/55 font-display text-xl text-gold backdrop-blur-[2px] cursor-pointer"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/70 text-2xl">▶</span>
              Tap to hear your reader
            </button>
          )}
          {started && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-lg cursor-pointer"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          )}
          {started && !showOptions && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-4 py-1.5 text-[12px] uppercase tracking-[0.25em] text-gold">
              Speaking <span className="animate-pulse">•••</span>
            </div>
          )}
        </div>

        {showOptions && (
          <div className="fade-in flex w-full flex-col items-center">
            <h1 className="mt-8 max-w-[632px] whitespace-pre-line text-center font-display text-[1.5rem] leading-[1.5] text-foreground sm:text-[1.8rem]">
              <HighlightedTitle parts={question.title} />
            </h1>
            <div className="mt-8 flex w-full max-w-[632px] flex-col gap-4">
              {question.options.map((opt, optIdx) => {
                const isChosen = selected === optIdx;
                const isFaded = selected !== null && !isChosen;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => handleClick(optIdx)}
                    style={{ animationDelay: `${optIdx * 120}ms` }}
                    className={`fade-in flex w-full items-center gap-4 border bg-foreground/[0.025] px-5 text-left text-base text-foreground/90 transition-all duration-300 cursor-pointer ${
                      opt.emoji ? "min-h-[89px] py-4" : "min-h-[70px] py-4"
                    } ${
                      isChosen
                        ? "border-gold/80 text-foreground shadow-option"
                        : "border-foreground/10 hover:border-gold/70"
                    } ${isFaded ? "opacity-40" : "opacity-100"}`}
                  >
                    {opt.emoji && (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-[22px]">
                        {opt.emoji}
                      </span>
                    )}
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

function LoadingStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let animId = 0;
    let timerId: NodeJS.Timeout | undefined;

    const frame = (now: number) => {
      const frac = Math.min(1, (now - start) / 4000);
      setProgress(Math.round(frac * 100));
      if (frac < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        timerId = setTimeout(() => onDoneRef.current(), 400);
      }
    };

    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="fade-in flex w-full flex-col items-center">
      <ProgressBar value={progress} className="mt-16" />
      <div className="mt-10 h-px w-40 bg-gold/20" />
      <p className="mt-16 text-center font-display text-[1.75rem] text-foreground/75">
        Tuning into your energy...
      </p>
    </div>
  );
}

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex w-full flex-col items-center">
      <ProgressBar value={100} className="mt-16" />
      <div className="mt-10 h-px w-40 bg-gold/20" />

      <div className="mt-14 flex max-w-[632px] flex-col gap-8 text-center font-display text-[1.3rem] leading-[1.9]">
        <p className="fade-in text-foreground" style={{ animationDelay: "0ms" }}>
          Based on everything you revealed to me...
        </p>
        <p className="fade-in text-foreground/70" style={{ animationDelay: "320ms" }}>
          The universe will filter thousands of possible combinations...
        </p>
        <p className="fade-in text-foreground" style={{ animationDelay: "640ms" }}>
          Down to the only <span className="text-gold">6 cards</span> able to speak directly to your
          energy in this exact moment.
        </p>
        <p className="fade-in text-foreground/70" style={{ animationDelay: "960ms" }}>
          Choose just <span className="text-gold">3</span> to discover the exact path that unlocks
          everything in <span className="text-gold">2026</span>.
        </p>
        <p className="fade-in text-[1.75rem] italic text-gold" style={{ animationDelay: "1280ms" }}>
          Get ready.
        </p>
      </div>

      <div className="fade-in mt-8 flex w-full justify-center" style={{ animationDelay: "1600ms" }}>
        <GoldButton reverse onClick={onContinue}>
          Choose my cards now
        </GoldButton>
      </div>
    </div>
  );
}

function DeckStep() {
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const isDone = selectedCards.length === 3;

  const handlePickCard = (cardIdx: number) => {
    if (!isDone && !selectedCards.includes(cardIdx)) {
      setSelectedCards((prev) => [...prev, cardIdx]);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <ProgressBar value={100} className="mt-12" />

      <div className="fade-in flex w-full flex-col items-center">
        <h1 className="mt-14 text-center font-display text-[2.15rem] text-gold">
          The deck is open for you
        </h1>
        <p className="mt-3 text-center font-display text-[1.45rem] italic text-foreground">
          Don't overthink it. <span className="text-gold">Just feel.</span>
        </p>
        <p className="mt-4 text-center text-base font-light text-foreground/70">
          Pick 3 cards, one at a time, in whatever order your instinct says:
        </p>
        <p className="mt-8 text-center text-sm uppercase tracking-[0.3em] text-gold">
          {selectedCards.length} of 3 cards chosen
        </p>

        {/* 6-Card Grid */}
        <div className="mt-10 grid w-full max-w-[728px] grid-cols-3 gap-2.5 sm:gap-4">
          {Array.from({ length: 6 }).map((_, cardIndex) => {
            const pickOrder = selectedCards.indexOf(cardIndex);
            const isFlipped = pickOrder !== -1;
            const revealedName = isFlipped ? REVEALED_CARDS[pickOrder] : null;
            const isFaded = isDone && !isFlipped;

            return (
              <button
                key={cardIndex}
                type="button"
                onClick={() => handlePickCard(cardIndex)}
                disabled={isDone || isFlipped}
                aria-label={revealedName ?? `Card ${cardIndex + 1}`}
                data-flipped={isFlipped}
                className={`tarot-card relative aspect-[345/553] w-full transition-all duration-500 ${
                  isFaded ? "opacity-40" : "opacity-100"
                } ${!isDone && !isFlipped ? "cursor-pointer hover:-translate-y-1" : "cursor-default"}`}
              >
                <div className="tarot-card-inner">
                  {/* Back face (Card Back) */}
                  <div className="tarot-face">
                    <img src={CARD_BACK} alt="" className="h-full w-full object-cover" />
                  </div>

                  {/* Front face (Revealed Card) */}
                  <div className="tarot-face tarot-face-front border border-gold/80 shadow-gold-soft">
                    {revealedName && (
                      <Fragment>
                        <img
                          src={CARD_IMAGES[revealedName]}
                          alt={revealedName}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-background/70 py-1 text-center font-display text-[11px] text-foreground sm:text-sm">
                          {revealedName}
                        </span>
                      </Fragment>
                    )}
                  </div>
                </div>

                {isFlipped && (
                  <span className="absolute left-1/2 top-0 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-b-full bg-gold text-[11px] font-semibold text-primary-foreground">
                    {pickOrder + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isDone ? (
          <GoldButton
            className="fade-in mt-10"
            onClick={() => navigate({ to: "/reading" })}
          >
            See my reading result
          </GoldButton>
        ) : (
          <p className="mt-10 text-center text-[15px] uppercase tracking-[0.25em] text-foreground/60">
            Tap the cards that call you
          </p>
        )}
      </div>
    </div>
  );
}
