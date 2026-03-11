// Database model types

export interface User {
  id: string;
  firebase_uid: string;
  name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Entry {
  id: string;
  user_id: string;
  audio_url: string;
  transcript: string | null;
  duration_seconds: number | null;
  weather_value: number | null;
  energy_level: 'low' | 'medium' | 'high' | null;
  safety_mode: boolean;
  created_at: Date;
}

export interface MirrorMoment {
  id: string;
  entry_id: string;
  user_id: string;
  distillation: string;
  vibe_tag: string;
  emotional_valence: 'expansive' | 'neutral' | 'contractive' | null;
  themes: string[] | null;
  deeper_prompt: string | null;
  confidence: number | null;
  character_refs: string[] | null;
  user_corrected: boolean;
  user_correction_text: string | null;
  created_at: Date;
}

export interface StoryScene {
  id: string;
  user_id: string;
  entry_id: string | null;
  scene_type: 'micro_update' | 'daily' | 'weekly';
  content: string;
  tone: string;
  created_at: Date;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  one_line_description: string | null;
  mention_count: number;
  rolling_summary: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserMemory {
  id: string;
  user_id: string;
  rolling_summary: string | null;
  chapter_index: any | null;
  updated_at: Date;
}
