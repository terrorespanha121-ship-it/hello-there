import { createFileRoute } from "@tanstack/react-router";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Cookies — Psychic Tarot Reading" },
      {
        name: "description",
        content:
          "How this tarot reading page uses advertising cookies, UTM tracking and your choices.",
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
          When you visit, we may record the campaign details in the link you arrived from (UTM parameters such as
          source, campaign and ad), the pages you view, your browser and device type, your IP address, and
          advertising cookie identifiers (Meta’s _fbp / _fbc).
        </p>

        <h2 className="font-display text-2xl text-gold">Who receives it and why</h2>
        <p>
          <strong className="text-gold">Meta Platforms</strong> (Facebook / Instagram) receives page visits and
          checkout activity through the Meta Pixel, to measure our ads and to help Meta show them to people
          likely to be interested (ad optimization).
        </p>
        <p>
          <strong className="text-gold">Utmify</strong> loads the Meta Pixel for us and keeps the campaign
          details so we can see which ad led to a purchase. The campaign details are also passed to our
          checkout provider, <strong className="text-gold">Cakto</strong>, so the purchase can be attributed to
          the right ad. To do this, Utmify looks up your IP address using the ipify service.
        </p>
        <p>
          The video on the reading page is provided by <strong className="text-gold">vturb</strong>.
        </p>

        <h2 className="font-display text-2xl text-gold">Your choice</h2>
        <p>
          In the EU, EEA, UK and Switzerland the Meta Pixel only runs after you click “Accept”. Elsewhere it runs
          by default, and you can turn it off at any time. Your choice, the date and the version of this notice
          are stored in your browser. Changing it takes effect immediately.
        </p>

        <p className="text-sm text-foreground/60">Last updated: November 4, 2026.</p>
      </article>
    </CosmicShell>
  );
}
