// Database Queries - Entries

import { pool } from '../../config/database';
import { Entry, MirrorMoment as DBMirrorMoment, StoryScene as DBStoryScene, Character } from '../../types/database';
import { MirrorMoment } from '../../types/ai';
import { v4 as uuidv4 } from 'uuid';

export async function createEntry(data: {
  user_id: string;
  audio_url: string;
  transcript?: string;
  duration_seconds?: number;
  weather_value?: number;
  energy_level?: 'low' | 'medium' | 'high';
  safety_mode?: boolean;
}): Promise<string> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO entries (id, user_id, audio_url, transcript, duration_seconds, weather_value, energy_level, safety_mode)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      id,
      data.user_id,
      data.audio_url,
      data.transcript || null,
      data.duration_seconds || null,
      data.weather_value || null,
      data.energy_level || null,
      data.safety_mode || false,
    ]
  );
  return result.rows[0].id;
}

export async function createMirrorMoment(data: {
  entry_id: string;
  user_id: string;
  mirrorMoment: MirrorMoment;
}): Promise<string> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO mirror_moments (
      id, entry_id, user_id, distillation, vibe_tag, emotional_valence,
      themes, deeper_prompt, confidence, character_refs
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id`,
    [
      id,
      data.entry_id,
      data.user_id,
      data.mirrorMoment.distillation,
      data.mirrorMoment.vibe_tag,
      data.mirrorMoment.emotional_valence,
      data.mirrorMoment.themes,
      data.mirrorMoment.deeper_prompt,
      data.mirrorMoment.confidence,
      data.mirrorMoment.character_refs,
    ]
  );
  return result.rows[0].id;
}

export async function createStoryScene(data: {
  user_id: string;
  entry_id: string;
  scene_type: 'micro_update' | 'daily' | 'weekly';
  content: string;
  tone: string;
}): Promise<string> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO story_scenes (id, user_id, entry_id, scene_type, content, tone)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [id, data.user_id, data.entry_id, data.scene_type, data.content, data.tone]
  );
  return result.rows[0].id;
}

export async function createCharacter(data: {
  user_id: string;
  name: string;
  relationship?: string;
  one_line_description?: string;
}): Promise<string> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO characters (id, user_id, name, relationship, one_line_description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [id, data.user_id, data.name, data.relationship || null, data.one_line_description || null]
  );
  return result.rows[0].id;
}

export async function getCharacters(userId: string) {
  const result = await pool.query(
    `SELECT id, name, relationship, one_line_description, created_at
     FROM characters
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}