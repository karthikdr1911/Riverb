// Onboarding Group Layout
// Wraps all onboarding screens with OnboardingProvider

import React from 'react';
import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../src/contexts/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#131313' },
          animation: 'none', // Custom animations handled per screen
        }}
      />
    </OnboardingProvider>
  );
}
