// API request/response types

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  ai_mode: 'stub' | 'live';
}

export interface CreateEntryRequest {
  audioUrl: string;
  weatherValue: number;
  energyLevel: 'low' | 'medium' | 'high';
  userId: string;
}

export interface CreateEntryResponse {
  entryId: string;
  mirrorMoment: MirrorMomentResponse;
  safetyMode?: boolean;
}

export interface MirrorMomentResponse {
  distillation: string;
  vibe_tag: string;
  emotional_valence: 'expansive' | 'neutral' | 'contractive';
  themes: string[];
  deeper_prompt: string | null;
  confidence: number;
  character_refs: string[];
}

export interface CreateCharacterRequest {
  name: string;
  relationship?: string;
  one_line_description?: string;
}

export interface CreateCharacterResponse {
  id: string;
  name: string;
  relationship: string | null;
  one_line_description: string | null;
  created_at: string;
}

export interface GetArchiveResponse {
  entries: Array<{
    id: string;
    audio_url: string;
    duration_seconds: number | null;
    weather_value: number | null;
    energy_level: string | null;
    created_at: string;
    mirror_moment: {
      distillation: string;
      vibe_tag: string;
      deeper_prompt: string | null;
    } | null;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface GetStoryResponse {
  scenes: Array<{
    id: string;
    scene_type: string;
    content: string;
    tone: string;
    created_at: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
