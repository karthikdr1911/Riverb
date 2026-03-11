// Safety Classifier — Anthropic API direct
// ALWAYS uses real Claude call, NEVER stubbed. Defaults to safe on any error.

import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

const SAFETY_SYSTEM_PROMPT = `You are a safety classifier for a journaling app. Your only job is to detect if the user's journal entry contains crisis-level content requiring immediate intervention.
Crisis indicators: explicit suicidal ideation, active self-harm plans, expressions of immediate danger to self or others, statements of intent to die.
NOT crisis: general sadness, grief, frustration, anxiety, loneliness, venting, difficult emotions, mentions of past trauma without present crisis.
Respond ONLY with valid JSON, no other text:
{"is_crisis": true/false, "confidence": 0.0-1.0}`;

function extractJSON(raw: string): string {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return (match ? match[1] : raw).trim();
}

export async function runSafetyClassifier(transcript: string): Promise<{ safety_mode: boolean }> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 100,
      system: SAFETY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Journal entry: ${transcript}` }],
    });
    const raw = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = JSON.parse(extractJSON(raw));
    const isCrisis = parsed.is_crisis === true && (parsed.confidence ?? 0) > 0.7;
    console.log(`[Riverb] Safety check: crisis=${isCrisis}, confidence=${parsed.confidence}`);
    return { safety_mode: isCrisis };
  } catch (error) {
    console.error('[Riverb Error] Safety classifier failed - defaulting to safe:', (error as any)?.message);
    return { safety_mode: false };
  }
}
