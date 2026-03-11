// Story Scene Generation — Anthropic API direct

import Anthropic from '@anthropic-ai/sdk';
import { MirrorMoment } from '../types/ai';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

const STORY_SYSTEM_PROMPT = `You are the story engine for Riverb. You write micro-update scenes — brief narrative prose that adds to the user's ongoing personal story. You are the biographer, not the author. The story belongs to the user.
Rules:
- Second-person POV: "You" not "I" or "[name]"
- Tone: Reflective — thoughtful, grounded, literary. Not sentimental. Not therapeutic.
- Length: 2-4 paragraphs, each 2-4 sentences. Total ~150-250 words.
- Never invent facts not in the transcript or Mirror Moment. Ground every observation.
- Never force a positive arc. If it was a hard day, the story holds that without redemption framing.
- Never use therapeutic language ("healing", "growth", "journey" as a metaphor, "self-care").
- The user's name, if used, appears only once, in the opening paragraph.
- Named people from character_refs may appear naturally if mentioned in transcript.
- Write as if this is one scene in a much longer personal novel. Not a summary. A scene.

Respond ONLY with the story scene prose. No JSON wrapper, no explanation, no title.`;

export const FALLBACK_STORY_SCENE = "You said something real today.";

export async function generateStoryScene(
  transcript: string,
  name: string,
  mirrorMoment: MirrorMoment
): Promise<string> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: STORY_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `User's name: ${name}\nToday's Mirror Moment:\ndistillation: ${mirrorMoment.distillation}\nvibe_tag: ${mirrorMoment.vibe_tag}\nthemes: ${mirrorMoment.themes.join(', ')}\ntemporal_orientation: ${mirrorMoment.temporal_orientation || 'present'}\nnarrative_arc_position: ${mirrorMoment.narrative_arc_position || 'threshold'}\nOriginal transcript: ${transcript}`,
      }],
    });
    const text = response.content[0].type === 'text' ? response.content[0].text : FALLBACK_STORY_SCENE;
    console.log('[Riverb] Story scene generated, length:', text.length);
    return text;
  } catch (error) {
    console.error('[Riverb Error] Story scene generation failed:', (error as any)?.message);
    return FALLBACK_STORY_SCENE;
  }
}
