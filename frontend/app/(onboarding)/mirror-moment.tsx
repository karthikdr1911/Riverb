// S10 - Mirror Moment Screen
// Displays real AI-generated mirror moment from onboarding context

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding, FALLBACK_MIRROR_MOMENT } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function MirrorMomentScreen() {
  const router = useRouter();
  const { mirrorMoment } = useOnboarding();
  const mm = mirrorMoment || FALLBACK_MIRROR_MOMENT;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.push('/(onboarding)/first-prompt')} visible={true} />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Section tag */}
        <Text style={styles.sectionTag}>mirror moment</Text>
        
        {/* Vibe tag */}
        <Text style={styles.vibeTag}>{mm.vibe_tag}</Text>
        
        {/* Distillation quote */}
        <Text style={styles.quote}>
          "{mm.distillation}"
        </Text>
        
        {/* Deeper prompt - only show if it exists */}
        {mm.deeper_prompt ? (
          <>
            <Text style={styles.deeperPrompt}>{mm.deeper_prompt}</Text>
            <Pressable
              style={styles.btnDeeper}
              onPress={() => router.push('/(onboarding)/first-prompt')}
            >
              <Text style={styles.btnDeeperText}>go deeper</Text>
            </Pressable>
          </>
        ) : null}
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Label */}
        <Text style={styles.label}>this is your mirror moment.</Text>
        
        {/* Continue button */}
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/story-preview')}
        >
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={9} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sectionTag: {
    fontFamily: Fonts.ui,
    fontSize: 9.3,
    color: Colors.ember,
    letterSpacing: getLetterSpacing(9.3, 0.18),
    textTransform: 'lowercase',
    marginBottom: 12,
  },
  vibeTag: {
    fontFamily: Fonts.displayItalic,
    fontSize: 19.2,
    fontStyle: 'italic',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 19,
  },
  quote: {
    fontFamily: Fonts.display,
    fontSize: 18.9,
    fontWeight: '300',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 18.9 * 1.52,
    maxWidth: 275,
    marginBottom: 21,
  },
  deeperPrompt: {
    fontFamily: Fonts.displayItalic,
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 14 * 1.55,
    maxWidth: 255,
  },
  btnDeeper: {
    marginTop: 14,
    paddingVertical: 9.6,
    paddingHorizontal: 22.4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.22)',
    borderRadius: 2,
  },
  btnDeeperText: {
    fontFamily: Fonts.ui,
    fontSize: 10.9,
    color: Colors.ember,
    letterSpacing: getLetterSpacing(10.9, 0.13),
    textTransform: 'lowercase',
  },
  divider: {
    width: 26,
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 21,
    marginBottom: 13,
  },
  label: {
    fontFamily: Fonts.ui,
    fontSize: 9.3,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(9.3, 0.12),
    textTransform: 'lowercase',
    marginBottom: 28,
  },
  button: {
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
});
