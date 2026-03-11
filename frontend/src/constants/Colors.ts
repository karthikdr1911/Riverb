// Riverb Design System - Colors
// Exact values from riverb-design-reference-v2.md

export const Colors = {
  // Core palette
  void: '#0D0D0D',        // Page background (desktop prototype only)
  surface: '#131313',     // Screen background - primary app background
  border: '#2C2C2C',      // All borders, dividers
  text: '#E8E8E8',        // Primary text - warm off-white
  textMuted: '#888888',   // Secondary text - body, prose
  textDim: '#444444',     // Tertiary - captions, labels
  ember: '#D4A574',       // Sole accent - amber/gold
  
  // Semantic colors
  background: '#131313',  // Alias for surface
  primary: '#D4A574',     // Alias for ember
  
  // Transparent variants for UI
  emberTransparent22: 'rgba(212, 165, 116, 0.22)',
  emberTransparent09: 'rgba(212, 165, 116, 0.09)',
  emberTransparent05: 'rgba(212, 165, 116, 0.05)',
  emberGlow065: 'rgba(212, 165, 116, 0.065)',
  borderHover: 'rgba(212, 165, 116, 0.4)',
} as const;

export type ColorKey = keyof typeof Colors;
