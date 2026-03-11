// Riverb Design System - Spacing
// 8pt grid system with exact values from design spec

export const Spacing = {
  // Base spacing units (8pt grid)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Screen padding
  screenPaddingTop: 76,      // Accounts for notch + back arrow
  screenPaddingBottom: 58,
  screenPaddingHorizontal: 30,
  
  // Component-specific spacing
  backButtonTop: 62,
  backButtonLeft: 22,
  topbarTop: 60,
  
  progressDotsBottom: 20,
  progressDotGap: 5,
  progressDotSize: 3,
  progressDotActiveWidth: 14,
  
  // Margins and gaps
  buttonMarginTop: 32,       // 2rem
  sectionMarginTop: 27.2,    // 1.7rem
  contentGap: 19.2,          // 1.2rem
  smallGap: 11.2,            // 0.7rem
  tinyGap: 7.2,              // 0.45rem
  
  // Form elements
  inputPaddingVertical: 6.4,
  inputPaddingHorizontal: 3.2,
  buttonPaddingVertical: 12.48,  // 0.78rem
  buttonPaddingHorizontal: 27.2, // 1.7rem
  
  // Record button
  recordButtonSize: 60,
  recordDotSize: 15,
  
  // Battery picker
  batteryTipWidth: 12,
  batteryTipHeight: 4,
  batteryBodyWidth: 40,
  batteryLowHeight: 40,
  batteryMediumHeight: 54,
  batteryHighHeight: 68,
  
  // Dividers
  dividerWidth: 26,
  dividerHeight: 1,
  
  // Glow
  glowSize: 420,
  
  // Max widths for content
  maxWidthH1: 290,
  maxWidthLead: 300,
  maxWidthMirrorQuote: 275,
  maxWidthMirrorDeeper: 255,
  maxWidthStory: 295,
  maxWidthCharForm: 295,
  maxWidthAfterglow: 260,
} as const;

export type SpacingKey = keyof typeof Spacing;
