import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CosmicShell, GoldButton } from "../components/CosmicShell";

const READER_PORTRAIT_URL = "/images/reader-portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <CosmicShell>
      <h1 className="fade-in mt-9 text-center font-display text-[2.15rem] leading-[1.2] text-foreground sm:text-[3.1rem]">
        <span className="text-gold">Discover for free</span>
        <br />
        what the cards are about to
        <br className="hidden sm:block" /> reveal about your life
      </h1>

      <p className="mt-5 max-w-[448px] text-center text-base font-light leading-[2.25] text-foreground/75">
        The cards of the sacred golden deck can reveal the exact path to remove the blocks in your life.
      </p>

      <div className="mt-11 w-full max-w-[448px] border border-gold/10 p-1.5">
        <img
          src={READER_PORTRAIT_URL}
          alt="Tarot reader with three cards on the table"
          width={434}
          height={455}
          className="block h-auto w-full"
        />
      </div>

      <GoldButton
        className="mt-12"
        onClick={() => navigate({ to: "/quiz" })}
      >
        Start my free reading →
      </GoldButton>

      <p className="mt-4 text-center text-[13px] uppercase tracking-[0.28em] text-gold">
        100% free · No sign-up · Takes 2 minutes
      </p>
    </CosmicShell>
  );
}
