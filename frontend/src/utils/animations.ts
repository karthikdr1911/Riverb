// Screen Transition Animations
// Fade up from translateY(20) to 0, opacity 0 to 1, 480ms
// Easing: cubic-bezier(0.4, 0, 0.2, 1)

import { Easing, withTiming, WithTimingConfig } from 'react-native-reanimated';

// Transition duration
export const TRANSITION_DURATION = 480; // ms

// Custom cubic-bezier easing (0.4, 0, 0.2, 1)
// This is the "ease-out" curve from the design spec
export const SCREEN_TRANSITION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

// Timing config for screen transitions
export const transitionConfig: WithTimingConfig = {
  duration: TRANSITION_DURATION,
  easing: SCREEN_TRANSITION_EASING,
};

// Initial values for entering screens
export const ENTERING_FROM = {
  opacity: 0,
  translateY: 20,
};

// Final values for entered screens
export const ENTERED_TO = {
  opacity: 1,
  translateY: 0,
};

// Values for exiting screens (upward)
export const EXITING_TO = {
  opacity: 0,
  translateY: -20,
};

// Helper function to animate screen entry
export const animateScreenEntry = (opacity: any, translateY: any) => {
  'worklet';
  opacity.value = withTiming(ENTERED_TO.opacity, transitionConfig);
  translateY.value = withTiming(ENTERED_TO.translateY, transitionConfig);
};

// Helper function to animate screen exit
export const animateScreenExit = (opacity: any, translateY: any) => {
  'worklet';
  opacity.value = withTiming(EXITING_TO.opacity, transitionConfig);
  translateY.value = withTiming(EXITING_TO.translateY, transitionConfig);
};

// Helper function to reset screen to initial state
export const resetScreenAnimation = (opacity: any, translateY: any) => {
  'worklet';
  opacity.value = ENTERING_FROM.opacity;
  translateY.value = ENTERING_FROM.translateY;
};
