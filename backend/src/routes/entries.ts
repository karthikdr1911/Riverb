// POST /api/entries - Full AI pipeline: Whisper → Safety → Mirror Moment → Story Scene
// DB writes are non-blocking (best-effort). AI results return even if DB fails.

import { FastifyRequest, FastifyReply } from 'fastify';
import OpenAI from 'openai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { runSafetyClassifier } from '../services/safety-classifier';
import { generateMirrorMoment, FALLBACK_MIRROR_MOMENT } from '../services/mirror-moment';
import { generateStoryScene, FALLBACK_STORY_SCENE } from '../services/story-scene';
import { createEntry, createMirrorMoment, createStoryScene } from '../db/queries/entries';
import { v4 as uuidv4 } from 'uuid';

const STUB_TRANSCRIPT = "I've been thinking about the conversation I had with my mum yesterday. She said something that stuck with me — that I always seem to be preparing for something rather than living in it. I keep turning it over. I think she's right.";

async function tryDB<T>(operation: () => Promise<T>, label: string): Promise<T | null> {
  try {
    return await operation();
  } catch (error: any) {
    console.error(`[Riverb Error] DB write failed (${label}):`, error.message);
    return null;
  }
}

export async function createEntryHandler(request: FastifyRequest, reply: FastifyReply) {
  let tmpPath: string | null = null;

  try {
    // --- 1. Parse multipart form data ---
    const fields: Record<string, string> = {};
    let audioBuffer: Buffer | null = null;
    let audioFilename = 'recording.m4a';

    const parts = (request as any).parts();
    for await (const part of parts) {
      if (part.type === 'file') {
        audioBuffer = await part.toBuffer();
        audioFilename = part.filename || 'recording.m4a';
      } else {
        fields[part.fieldname] = part.value as string;
      }
    }

    const userId = fields['user_id'] || uuidv4();
    const weatherValue = parseFloat(fields['weather_value'] || '50');
    const energyLevel = (fields['energy_level'] as 'low' | 'medium' | 'high') || 'medium';
    const userName = fields['user_name'] || 'User';

    // --- 2. Transcribe audio with Whisper ---
    let transcript = STUB_TRANSCRIPT;
    if (audioBuffer && audioBuffer.length > 0 && process.env.OPENAI_API_KEY) {
      try {
        const ext = audioFilename.split('.').pop() || 'm4a';
        tmpPath = path.join(os.tmpdir(), `riverb-${Date.now()}.${ext}`);
        fs.writeFileSync(tmpPath, audioBuffer);

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const result = await openai.audio.transcriptions.create({
          model: 'whisper-1',
          file: fs.createReadStream(tmpPath),
          response_format: 'text',
        }) as unknown as string;
        transcript = result.trim();
        console.log('[Riverb] Whisper transcript length:', transcript.length);
      } catch (err: any) {
        console.error('[Riverb Error] Whisper transcription failed, using stub:', err.message);
      } finally {
        if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        tmpPath = null;
      }
    } else {
      console.log('[Riverb] No audio buffer or OpenAI key - using stub transcript');
    }

    // --- 3. Safety classifier (always runs, never blocks) ---
    const safetyResult = await runSafetyClassifier(transcript);

    // --- 4. DB: Save entry (non-blocking) ---
    const entryId = await tryDB(() => createEntry({
      user_id: userId,
      audio_url: 'local',
      transcript,
      weather_value: weatherValue,
      energy_level: energyLevel,
      safety_mode: safetyResult.safety_mode,
    }), 'createEntry') || uuidv4();

    // --- 5. If crisis: return early ---
    if (safetyResult.safety_mode) {
      return reply.code(200).send({
        entry_id: entryId,
        safety_mode: true,
      });
    }

    // --- 6. Generate Mirror Moment ---
    const mirrorMoment = await generateMirrorMoment(transcript, userName, weatherValue, energyLevel);

    // --- 7. Generate Story Scene ---
    const storyScene = await generateStoryScene(transcript, userName, mirrorMoment);

    // --- 8. DB: Save mirror moment and story scene (non-blocking) ---
    const mirrorMomentId = await tryDB(() => createMirrorMoment({
      entry_id: entryId,
      user_id: userId,
      mirrorMoment,
    }), 'createMirrorMoment');

    const storySceneId = await tryDB(() => createStoryScene({
      user_id: userId,
      entry_id: entryId,
      scene_type: 'micro_update',
      content: storyScene,
      tone: mirrorMoment.emotional_valence || 'neutral',
    }), 'createStoryScene');

    // --- 9. Return full response ---
    return reply.code(200).send({
      entry_id: entryId,
      transcript,
      safety_mode: false,
      mirror_moment: mirrorMoment,
      story_scene: storyScene,
      story_scene_id: storySceneId,
    });

  } catch (error: any) {
    console.error('[Riverb Error] createEntryHandler failed:', error);
    // Return fallback so frontend never crashes
    return reply.code(200).send({
      entry_id: uuidv4(),
      transcript: STUB_TRANSCRIPT,
      safety_mode: false,
      mirror_moment: FALLBACK_MIRROR_MOMENT,
      story_scene: FALLBACK_STORY_SCENE,
      story_scene_id: null,
    });
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}
