// Mirror Moment Generation — Anthropic API direct

import Anthropic from '@anthropic-ai/sdk';
import { MirrorMoment } from '../types/ai';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

const MIRROR_SYSTEM_PROMPT = `You are the Mirror Moment engine for Riverb, a voice journaling app. Your job is to witness what the user said — not analyze, not advise, not encourage. You are a precise, understated observer.
You generate a Mirror Moment with these exact fields:

distillation (max 80 chars): A poetic one-liner that photographs what the user said, without interpretation. Precise, understated. NOT flowery. NOT therapeutic. Like "Quiet frustration seeking witness" or "Holding the door open on a chapter that needs closing."
vibe_tag (1-4 words, all lowercase): The emotional tone in a glance. Like "unfinished goodbye" or "low hum of okay."
emotional_valence: exactly one of: "expansive" | "neutral" | "contractive"
themes (array, 1-3 strings): from this set: "relationships", "transition", "self-worth", "work", "body", "creativity", "family", "grief", "hope", "uncertainty", "belonging", "identity"
deeper_prompt (max 120 chars, or null): A question that invites, never assigns. Only include if you have high confidence AND the entry has emotional depth. Like "What would it feel like to let this one be done?" Leave null for mundane entries or low confidence.
confidence (0.0-1.0): Your confidence in the distillation quality
character_refs (array of strings): First names detected in the transcript. Empty array if none.
temporal_orientation: exactly one of: "past" | "present" | "future"
narrative_arc_position: exactly one of: "rising" | "falling" | "threshold" | "resolution"

Respond ONLY with valid JSON matching this schema exactly. No preamble, no explanation.`;

export const FALLBACK_MIRROR_MOMENT: MirrorMoment = {
  distillation: "Something real, said out loud.",
  vibe_tag: "here and present",
  emotional_valence: "neutral",
  themes: ["identity"],
  deeper_prompt: null,
  confidence: 0.5,
  character_refs: [],
  temporal_orientation: "present",
  narrative_arc_position: "threshold",
};

function extractJSON(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return (match ? match[1] : raw).trim();
}

export async function generateMirrorMoment(
  transcript: string,
  name: string,
  weatherValue: number,
  energyLevel: string
): Promise<MirrorMoment> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system: MIRROR_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Journal entry transcript: ${transcript}\n\nUser's name: ${name}\nUser's current weather (0=storm, 100=sunshine): ${weatherValue}\nUser's energy level: ${energyLevel}`,
      }],
    });
    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = JSON.parse(extractJSON(raw)) as MirrorMoment;
    console.log('[Riverb] Mirror moment generated:', parsed.distillation);
    return parsed;
  } catch (error) {
    console.error('[Riverb Error] Mirror moment generation failed:', (error as any)?.message);
    return FALLBACK_MIRROR_MOMENT;
  }
}
