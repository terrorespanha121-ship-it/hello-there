import { createFileRoute } from "@tanstack/react-router";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Cookies — Psychic Tarot Reading" },
      {
        name: "description",
        content:
          "How this tarot reading page uses your data and keeps your privacy.",
      },
      { property: "og:title", content: "Privacy & Cookies — Psychic Tarot Reading" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <CosmicShell>
      <article className="mt-8 w-full max-w-[720px] space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
        <h1 className="text-center font-display text-4xl text-gold">Privacy & Cookies</h1>

        <h2 className="pt-2 font-display text-2xl text-gold">What we collect</h2>
        <p>
          This site does not use advertising pixels or tracking tags. Your quiz answers and video progress are
          stored only in your own browser.
        </p>

        <h2 className="font-display text-2xl text-gold">Payments</h2>
        <p>
          Purchases are handled by our checkout provider, <strong className="text-gold">Cakto</strong>, under its
          own privacy policy.
        </p>

        <p className="text-sm text-foreground/60">Last updated: November 4, 2026.</p>
      </article>
    </CosmicShell>
  );
}
