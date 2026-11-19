import { createFileRoute } from "@tanstack/react-router";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Cookies — Psychic Tarot Reading" },
      {
        name: "description",
        content:
          "How this tarot reading page handles your privacy.",
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

        <p>
          We do not use advertising pixels or tracking tools on this site. Payments are handled by our checkout
          provider, <strong className="text-gold">Cakto</strong>.
        </p>

        <p className="text-sm text-foreground/60">Last updated: November 4, 2026.</p>
      </article>
    </CosmicShell>
  );
}
