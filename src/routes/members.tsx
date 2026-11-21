import { createFileRoute } from "@tanstack/react-router";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Your Sacred Members Area" },
      { name: "description", content: "Your readings and rituals are being prepared." },
      { property: "og:title", content: "Your Sacred Members Area" },
      { property: "og:description", content: "Your readings and rituals are being prepared." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Members,
});

function Members() {
  return (
    <CosmicShell>
      <h1 className="mt-12 text-center font-display text-3xl text-gold">Welcome to your sacred space</h1>
      <p className="mt-4 max-w-md text-center text-foreground/75">Your members area is being prepared. You will receive access shortly.</p>
    </CosmicShell>
  );
}
