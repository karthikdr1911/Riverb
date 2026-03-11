// OnboardingContext - Full state management for onboarding flow
// Includes: user identity, weather/energy, AI results, pending API promise

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface MirrorMomentData {
  distillation: string;
  vibe_tag: string;
  emotional_valence: 'expansive' | 'neutral' | 'contractive';
  themes: string[];
  deeper_prompt: string | null;
  confidence: number;
  character_refs: string[];
  temporal_orientation?: string;
  narrative_arc_position?: string;
}

export interface EntryResponse {
  entry_id: string;
  transcript?: string;
  safety_mode: boolean;
  mirror_moment?: MirrorMomentData;
  story_scene?: string;
  story_scene_id?: string | null;
}

export const FALLBACK_MIRROR_MOMENT: MirrorMomentData = {
  distillation: "Something real, said out loud.",
  vibe_tag: "here and present",
  emotional_valence: "neutral",
  themes: ["identity"],
  deeper_prompt: null,
  confidence: 0.5,
  character_refs: [],
};

interface OnboardingState {
  userName: string;
  weatherValue: number;
  energyLevel: 'low' | 'medium' | 'high' | null;
  userId: string;
  entryId: string | null;
  mirrorMoment: MirrorMomentData | null;
  storyScene: string | null;
}

interface OnboardingContextType extends OnboardingState {
  setUserName: (name: string) => void;
  setWeatherValue: (value: number) => void;
  setEnergyLevel: (level: 'low' | 'medium' | 'high') => void;
  setEntryId: (id: string) => void;
  setMirrorMoment: (mm: MirrorMomentData | null) => void;
  setStoryScene: (scene: string | null) => void;
  setPendingEntryPromise: (p: Promise<EntryResponse>) => void;
  getPendingEntryPromise: () => Promise<EntryResponse> | null;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [weatherValue, setWeatherValue] = useState(50);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [userId] = useState<string>(generateUUID); // Generated once per session
  const [entryId, setEntryId] = useState<string | null>(null);
  const [mirrorMoment, setMirrorMoment] = useState<MirrorMomentData | null>(null);
  const [storyScene, setStoryScene] = useState<string | null>(null);
  const pendingEntryPromiseRef = useRef<Promise<EntryResponse> | null>(null);

  // Persist userId across app restarts
  useEffect(() => {
    AsyncStorage.getItem('riverb_user_id').then((stored) => {
      if (!stored) {
        AsyncStorage.setItem('riverb_user_id', userId).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const resetOnboarding = () => {
    setEntryId(null);
    setMirrorMoment(null);
    setStoryScene(null);
    pendingEntryPromiseRef.current = null;
  };

  return (
    <OnboardingContext.Provider
      value={{
        userName,
        weatherValue,
        energyLevel,
        userId,
        entryId,
        mirrorMoment,
        storyScene,
        setUserName,
        setWeatherValue,
        setEnergyLevel,
        setEntryId,
        setMirrorMoment,
        setStoryScene,
        setPendingEntryPromise: (p) => { pendingEntryPromiseRef.current = p; },
        getPendingEntryPromise: () => pendingEntryPromiseRef.current,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
