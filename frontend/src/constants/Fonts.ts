// Riverb Design System - Typography
// Font families and weights from riverb-design-reference-v2.md

export const Fonts = {
  // Font families
  display: 'Newsreader_300Light',          // Serif for literary content
  displayItalic: 'Newsreader_300Light_Italic',
  displayRegular: 'Newsreader_400Regular', // Only for <strong> emphasis
  ui: 'Inter_400Regular',                   // Sans-serif for UI chrome
  uiMedium: 'Inter_500Medium',              // For stronger UI elements
  
  // Font sizes (in dp, converted from rem where 1rem = 16dp)
  sizes: {
    // Display/Heading sizes
    splash: 67.2,         // 4.2rem - "riverb" splash title
    h1: 28.8,             // 1.8rem - screen headings
    h1Small: 24,          // 1.5rem - smaller headings (S12)
    h1Reduced: 24.8,      // 1.55rem - afterglow headings
    
    // Timers and large numbers
    timer: 57.6,          // 3.6rem - recording timer
    statNumber: 21.6,     // 1.35rem - stats on ready screen
    readySymbol: 32,      // 2rem - ✻ symbol
    
    // Content sizes
    lead: 17.6,           // 1.1rem - intro paragraph text
    mirrorTag: 19.2,      // 1.2rem - vibe tag (e.g., "quiet unravelling")
    mirrorQuote: 18.88,   // 1.18rem - distillation quote
    afterglowResponse: 16.8, // 1.05rem - afterglow response text
    nameInput: 26.4,      // 1.65rem - name input field
    weatherWord: 14.72,   // 0.92rem - dynamic weather word
    processing: 24,       // 1.5rem - "Listening..."
    
    // Story and prose
    storyProse: 14.08,    // 0.88rem - story paragraph text
    mirrorDeeper: 14.08,  // 0.88rem - deeper prompt question (italic)
    
    // Small text
    leadSmall: 12.8,      // 0.8rem - S12 subtext
    suggestion: 13.12,    // 0.82rem - rotating suggestions
    afterglowOption: 11.52, // 0.72rem - afterglow option labels
    caption: 11.2,        // 0.7rem - general captions
    smallCaption: 10.4,   // 0.65rem - ghost button text
    tapFinish: 9.92,      // 0.62rem - "tap to finish"
    label: 9.28,          // 0.58rem - field labels, tags
    
    // UI chrome
    button: 11.2,         // 0.7rem - button text
    btnDeeper: 10.88,     // 0.68rem - "go deeper" button
    relTag: 9.92,         // 0.62rem - relationship tags
    charInput: 13.44,     // 0.84rem - character input fields
    sliderLabel: 9.92,    // 0.62rem - slider end labels
    wordmark: 11.2,       // 0.7rem - topbar wordmark
    backArrow: 12,        // 0.75rem - back button arrow
    
    // Icon sizes
    agIcon: 12.8,         // 0.8rem - afterglow option icons
  },
  
  // Line heights (multipliers)
  lineHeights: {
    tight: 1.2,           // h1 headings
    normal: 1.52,         // mirror quote
    relaxed: 1.65,        // afterglow responses
    loose: 1.75,          // lead paragraphs
    veryLoose: 1.88,      // story prose
  },
  
  // Letter spacing (as multipliers of font size)
  letterSpacing: {
    tight: -0.01,         // splash title
    normal: 0.04,         // recording timer
    medium: 0.06,         // captions
    wide: 0.08,           // battery labels, ghost buttons
    wider: 0.1,           // slider labels
    widest: 0.12,         // field labels, afterglow options
    button: 0.13,         // button text
    sectionTag: 0.16,     // story chapter tag
    wordmark: 0.18,       // "riverb" wordmark
  },
} as const;

// Helper to calculate letter spacing in dp
export const getLetterSpacing = (fontSize: number, multiplier: number): number => {
  return fontSize * multiplier;
};
