// Riverb - Rotating Suggestions for S7 (First Prompt screen)
// Exact copy from riverb-flow-spec.md

export const RotatingSuggestions = [
  "What happened at work today?",
  "What felt heavy going through your day?",
  "Is there something you've been avoiding saying?",
  "What's been sitting in the back of your mind?",
] as const;

export const SUGGESTION_ROTATION_INTERVAL = 2000; // 2000ms
export const SUGGESTION_FADE_DURATION = 500;      // 500ms
export const SUGGESTION_START_DELAY = 400;        // 400ms after screen activates
