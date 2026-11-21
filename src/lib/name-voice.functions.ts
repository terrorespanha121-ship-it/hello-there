import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const VOICE_ID = "3XD5qTvPWht0mpTnYXY0";

export const generateNameVoice = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ name: z.string().trim().min(1).max(30).regex(/^[\p{L}\p{M}' -]+$/u) }).parse(input)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["ELEVENLABS_API_KEY"];
    if (!apiKey) return { audio: null as string | null, error: "missing key" };
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${data.name}...`,
          model_id: "eleven_flash_v2_5",
          voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true, speed: 0.9 },
        }),
      }
    );
    if (!res.ok) {
      console.error(`ElevenLabs failed [${res.status}]: ${await res.text()}`);
      return { audio: null as string | null, error: `tts ${res.status}` };
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { audio: btoa(bin), error: null as string | null };
  });
