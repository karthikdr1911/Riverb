// AI Types - updated with all Mirror Moment fields

export interface MirrorMoment {
  distillation: string;
  vibe_tag: string;
  emotional_valence: 'expansive' | 'neutral' | 'contractive';
  themes: string[];
  deeper_prompt: string | null;
  confidence: number;
  character_refs: string[];
  temporal_orientation?: 'past' | 'present' | 'future';
  narrative_arc_position?: 'rising' | 'falling' | 'threshold' | 'resolution';
}

export interface StoryScene {
  scene_type: 'micro_update' | 'daily' | 'weekly';
  tone: string;
  content: string;
}

export interface SafetyResult {
  status: 'safe' | 'crisis';
}
