-- Riverb Phase 0 - PostgreSQL Schema
-- 6 tables: users, entries, mirror_moments, story_scenes, characters, user_memory

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- 2. Entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  duration_seconds INT,
  weather_value INT CHECK (weather_value >= 0 AND weather_value <= 100),
  energy_level VARCHAR(20) CHECK (energy_level IN ('low', 'medium', 'high')),
  safety_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);

-- 3. Mirror Moments table
CREATE TABLE IF NOT EXISTS mirror_moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  distillation TEXT NOT NULL,
  vibe_tag VARCHAR(100) NOT NULL,
  emotional_valence VARCHAR(20) CHECK (emotional_valence IN ('expansive', 'neutral', 'contractive')),
  themes TEXT[],
  deeper_prompt TEXT,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  character_refs TEXT[],
  user_corrected BOOLEAN DEFAULT FALSE,
  user_correction_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mirror_moments_user_id ON mirror_moments(user_id);
CREATE INDEX idx_mirror_moments_entry_id ON mirror_moments(entry_id);
CREATE INDEX idx_mirror_moments_created_at ON mirror_moments(created_at DESC);

-- 4. Story Scenes table
CREATE TABLE IF NOT EXISTS story_scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  scene_type VARCHAR(20) NOT NULL CHECK (scene_type IN ('micro_update', 'daily', 'weekly')),
  content TEXT NOT NULL,
  tone VARCHAR(20) DEFAULT 'reflective',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_story_scenes_user_id ON story_scenes(user_id);
CREATE INDEX idx_story_scenes_created_at ON story_scenes(created_at DESC);
CREATE INDEX idx_story_scenes_scene_type ON story_scenes(scene_type);

-- 5. Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  relationship VARCHAR(50),
  one_line_description TEXT,
  mention_count INT DEFAULT 1,
  rolling_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_name ON characters(name);

-- 6. User Memory table (for rolling context)
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rolling_summary TEXT,
  chapter_index JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_memory_user_id ON user_memory(user_id);

-- Trigger to update updated_at on users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_memory_updated_at BEFORE UPDATE ON user_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
