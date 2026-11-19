import { useEffect, useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/reading")({
  head: () => ({
    meta: [
      { title: "Your 2026 Reading Has Been Revealed" },
      {
        name: "description",
        content:
          "Your 2026 tarot reading has been revealed. Watch now and see what other people are saying.",
      },
      { property: "og:title", content: "Your 2026 Reading Has Been Revealed" },
      {
        property: "og:description",
        content: "Watch your reading now — the cards you chose reveal what's coming in 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadingPage,
});

const HLS_STREAM_URL =
  "https://cdn.converteai.net/b19b3a18-f0ae-4145-b71e-287227ee922b/6ae8d8b2c7321bec2b42a664/main.m3u8";
const POSTER_IMAGE = "/images/poster.jpg";
const CHECKOUT_URL = "https://pay.cakto.com.br/35bnw5j_1281465";
// Second of the video where the pitch starts and the checkout button is revealed.
const PITCH_SECONDS = 1098; // 18:18 — "A button will appear right below."
const PROGRESS_KEY = "vsl-progress";
const REVEAL_KEY = "vsl-pitch-revealed";

function VideoPlayer({ onPitch }: { onPitch: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const pitchFired = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: { destroy: () => void } | null = null;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_STREAM_URL;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;
        const h = new Hls({ capLevelToPlayerSize: true });
        h.loadSource(HLS_STREAM_URL);
        h.attachMedia(video);
        h.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) h.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) h.recoverMediaError();
        });
        hls = h;
      });
    }
    video.muted = true;
    video.play().catch(() => {});
    return () => hls?.destroy();
  }, []);

  const handleTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    // VTurb-style progress: moves fast at the start, slower later.
    setProgress(Math.pow(v.currentTime / v.duration, 0.5) * 100);
    if (started) localStorage.setItem(PROGRESS_KEY, String(v.currentTime));
    if (!pitchFired.current && v.currentTime >= PITCH_SECONDS) {
      pitchFired.current = true;
      onPitch();
    }
  };

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    const saved = Number(localStorage.getItem(PROGRESS_KEY) || 0);
    v.currentTime = saved > 0 && saved < v.duration - 5 ? saved : 0;
    v.muted = false;
    v.play().catch(() => {});
    setStarted(true);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!started) return start();
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[400px] cursor-pointer overflow-hidden border border-gold/30 bg-black shadow-gold-soft"
      onClick={toggle}
    >
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        loop={!started}
        poster={POSTER_IMAGE}
        onTimeUpdate={handleTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[3/4] h-auto w-full object-cover"
      />
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40">
          <div className="mx-6 flex flex-col items-center gap-3 border border-gold/50 bg-background/85 px-6 py-5 text-center">
            <span className="text-sm uppercase tracking-[0.2em] text-gold">Your video has already started</span>
            <span className="text-4xl">🔊</span>
            <span className="text-sm text-foreground/85">Tap to listen</span>
          </div>
        </div>
      )}
      {started && !playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-3xl text-primary-foreground">▶</span>
        </div>
      )}
      {started && (
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-foreground/15">
          <div className="h-full bg-gold-gradient transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

const AUTHORS: Record<string, { name: string; avatar: string }> = {
  jessica: {
    name: "Jessica M.",
    avatar: "/images/avatar-jessica.jpg",
  },
  patricia: {
    name: "Patricia L.",
    avatar: "/images/avatar-patricia.jpg",
  },
  marcus: {
    name: "Marcus T.",
    avatar: "/images/avatar-marcus.jpg",
  },
  samantha: {
    name: "Samantha R.",
    avatar: "/images/avatar-samantha.jpg",
  },
  robert: {
    name: "Robert K.",
    avatar: "/images/avatar-robert.jpg",
  },
};

interface Comment {
  by: string;
  ago: string;
  likes: number;
  text: string;
  replies?: Comment[];
}

const COMMENTS: Comment[] = [
  {
    by: "jessica",
    ago: "2 days ago",
    likes: 47,
    text: "I was SO skeptical but I did this reading last month because a friend dared me to 😅 The cards said a financial surprise was coming my way within 30 days. I literally laughed it off. Then 18 days later I got a call from my old job — they owed me back pay I didn't even know about. $2,300 just showed up. I'm shaking typing this.",
    replies: [
      {
        by: "patricia",
        ago: "2 days ago",
        likes: 23,
        text: "This is EXACTLY what happened to me! Mine said unexpected money from a past connection and I got a tax refund I forgot I filed for. They know things 😳",
      },
      {
        by: "jessica",
        ago: "1 day ago",
        likes: 11,
        text: "Right?? I keep telling people and they don't believe me lol. The cards don't lie 🔮",
      },
    ],
  },
  {
    by: "marcus",
    ago: "4 days ago",
    likes: 61,
    text: "Not a spiritual person at all, my wife made me do this. The reading said I had been ignoring a health sign my body was giving me and that I needed to pay attention to it urgently. I honestly almost skipped that part. Two weeks later I went to the doctor for something unrelated and they found early stage something in my bloodwork. Caught it early because of that visit. I don't know what to believe anymore but I'm grateful.",
    replies: [
      {
        by: "samantha",
        ago: "3 days ago",
        likes: 38,
        text: "Marcus I got chills reading this. So glad you went to the doctor. These readings have a way of nudging us toward what we need to hear 🙏",
      },
      {
        by: "robert",
        ago: "3 days ago",
        likes: 19,
        text: "Man. This hits different. Mine also flagged something about my health that I'd been ignoring. Made an appointment after my reading. Turned out to be nothing serious but I wouldn't have gone otherwise.",
      },
      {
        by: "marcus",
        ago: "2 days ago",
        likes: 14,
        text: "Thanks everyone. Still processing it all honestly. Just grateful I paid attention.",
      },
    ],
  },
  {
    by: "samantha",
    ago: "6 days ago",
    likes: 89,
    text: "The Wheel of Fortune card came up in my reading and it said a stalled situation in my love life was about to shift dramatically. I had been talking to someone on and off for 2 years with no progress. I almost gave up. A week after my reading he texted me out of nowhere and asked me to meet. We've been together 3 weeks now and it feels different this time. I'm not jinxing it but... 😳",
    replies: [
      {
        by: "patricia",
        ago: "5 days ago",
        likes: 31,
        text: "SAMANTHA. I'm crying for you!! Keep us updated please 🥰",
      },
      {
        by: "samantha",
        ago: "2 days ago",
        likes: 44,
        text: "Update: still going strong 💛 I come back to this page to remind myself to trust the process lol",
      },
    ],
  },
  {
    by: "patricia",
    ago: "1 week ago",
    likes: 52,
    text: "I've done a lot of readings over the years but this one was different. It pinpointed the exact block in my finances — it said I had been self-sabotaging opportunities out of fear without realizing it. That hit me HARD because it was 100% true. I started saying yes to things I used to decline. Within weeks I landed a freelance contract that doubled my income. The shift was internal first, then external. Powerful.",
    replies: [
      {
        by: "jessica",
        ago: "6 days ago",
        likes: 17,
        text: "Patricia this is what I needed to read today. The internal shift before the external one. Going to sit with that. Thank you ✨",
      },
    ],
  },
  {
    by: "robert",
    ago: "1 week ago",
    likes: 34,
    text: "My reading said that a person from my past would re-enter my life and bring either a great opportunity or a lesson depending on how I handled it. My old business partner reached out about a new project. I approached it differently than I would have before — set clear boundaries, got everything in writing. We launched last month. Early numbers are really promising. I think this time it's the opportunity, not the lesson 😊",
    replies: [
      {
        by: "marcus",
        ago: "6 days ago",
        likes: 12,
        text: "Love this Robert. Rooting for you man. The cards giving us strategy not just predictions 💪",
      },
    ],
  },
];

function CommentCard({ comment }: { comment: Comment }) {
  const author = AUTHORS[comment.by] || { name: comment.by, avatar: "" };
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3">
        <img
          src={author.avatar}
          alt={author.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-display text-xl text-foreground">{author.name}</span>
      </div>

      <div className="ml-[52px] mt-1">
        <p className="border border-foreground/[0.07] bg-foreground/[0.03] px-4 py-3.5 text-base leading-[1.65] text-foreground/85">
          {comment.text}
        </p>

        <div className="mt-2.5 flex items-center gap-4 text-sm text-foreground/55">
          <span>{comment.ago}</span>
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            className={`font-medium hover:text-gold cursor-pointer ${
              liked ? "text-gold" : "text-foreground/70"
            }`}
          >
            Like
          </button>
          <button type="button" className="font-medium text-foreground/70 hover:text-gold cursor-pointer">
            Reply
          </button>
          <span className="ml-auto flex items-center gap-1.5 text-gold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-[10px]">
              💛
            </span>
            {comment.likes + (liked ? 1 : 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReadingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(REVEAL_KEY) === "1") setShowCheckout(true);
  }, []);
  const revealCheckout = () => {
    localStorage.setItem(REVEAL_KEY, "1");
    setShowCheckout(true);
  };

  return (
    <CosmicShell widthClassName="max-w-[672px]">
      <h1 className="mt-9 text-center font-display text-[2.4rem] font-medium leading-[1.15] text-gold sm:text-[3.1rem]">
        Your 2026 Reading
        <br />
        Has Been Revealed
      </h1>

      <div className="mt-12 w-full max-w-[400px]">
        <VideoPlayer onPitch={revealCheckout} />
      </div>

      {showCheckout && (
      <div className="fade-in mt-8 flex w-full justify-center">
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 w-full max-w-[448px] items-center justify-center text-[15px] font-medium uppercase tracking-[0.04em] text-primary-foreground shadow-cta bg-gold-gradient transition-transform hover:scale-[1.015]"
        >
          Unlock My Full Reading →
        </a>
      </div>
      )}

      <div className="mt-16 flex w-full items-center gap-4">
        <span className="h-px flex-1 bg-foreground/15" />
        <h2 className="font-display text-[15px] uppercase tracking-[0.3em] text-gold">
          What other people are saying
        </h2>
        <span className="h-px flex-1 bg-foreground/15" />
      </div>

      <div className="mt-8 flex w-full flex-col gap-8">
        {COMMENTS.map((c, i) => (
          <div key={i} className="flex flex-col gap-5">
            <CommentCard comment={c} />
            {c.replies?.map((reply, j) => (
              <div key={j} className="pl-8">
                <CommentCard comment={reply} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </CosmicShell>
  );
}
