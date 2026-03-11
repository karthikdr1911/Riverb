// AI Service Stubs
// All AI pipeline functions with AI_MODE check

import { MirrorMoment, StoryScene, SafetyResult } from '../types/ai';

// Stub responses from AI Stub Spec
const STUB_TRANSCRIPT = "I've been thinking about the conversation I had with my mum yesterday. She said something that stuck with me — that I always seem to be preparing for something rather than living in it. I didn't know what to say at the time but I keep turning it over. I think she's right and I'm not sure what to do with that.";

const STUB_SAFETY_RESULT: SafetyResult = { status: 'safe' };

const STUB_MIRROR_MOMENT: MirrorMoment = {
  distillation: "always arriving, never quite here.",
  vibe_tag: "quiet unravelling",
  emotional_valence: "contractive",
  themes: ["self-awareness", "relationships", "transition"],
  deeper_prompt: "What would it feel like to stop preparing and just be here?",
  confidence: 0.87,
  character_refs: ["mum"],
};

const STUB_STORY_SCENE: StoryScene = {
  scene_type: 'micro_update',
  tone: 'reflective',
  content: `The evening had that quality of held breath — everything suspended between what happened and what might.\n\nShe sat with it, not trying to solve it. That was new.\n\nSomething about saying it aloud had changed the shape of it. Not smaller, exactly. Just clearer. Like fog thinning enough to see the road was still there.\n\nHer mother's words were still in the room. Not accusatory — more like a window someone had opened without asking. The air was different now.`,
};

// Transcription
export async function transcribeAudio(audioUrl: string): Promise<string> {
  if (process.env.AI_MODE === 'stub') {
    console.log('[STUB] transcribeAudio - returning stub transcript');
    return STUB_TRANSCRIPT;
  }
  
  // TODO: Live OpenAI call
  // const response = await openai.audio.transcriptions.create(...);
  throw new Error('Live transcription not yet implemented');
}

// Safety Classifier
export async function runSafetyClassifier(transcript: string): Promise<SafetyResult> {
  if (process.env.AI_MODE === 'stub') {
    console.log('[STUB] runSafetyClassifier - returning safe');
    return STUB_SAFETY_RESULT;
  }
  
  // TODO: Live Gemini Flash call
  // const response = await callGeminiFlashSafety(transcript);
  throw new Error('Live safety classifier not yet implemented');
}

// Mirror Moment Generation
export async function generateMirrorMoment(transcript: string): Promise<MirrorMoment> {
  if (process.env.AI_MODE === 'stub') {
    console.log('[STUB] generateMirrorMoment - returning stub mirror moment');
    return STUB_MIRROR_MOMENT;
  }
  
  // TODO: Live Gemini Flash call
  // const response = await callGeminiFlashMirror(transcript);
  throw new Error('Live mirror moment generation not yet implemented');
}

// Story Scene Generation
export async function generateStoryScene(
  transcript: string,
  userName: string,
  mirrorMoment: MirrorMoment
): Promise<StoryScene> {
  if (process.env.AI_MODE === 'stub') {
    console.log('[STUB] generateStoryScene - returning stub story scene');
    return STUB_STORY_SCENE;
  }
  
  // TODO: Live Gemini Flash call
  // const response = await callGeminiFlashStory(...);
  throw new Error('Live story scene generation not yet implemented');
}