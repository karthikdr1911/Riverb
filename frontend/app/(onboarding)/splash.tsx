// S1 - Splash Screen
// "riverb" with dual-layer ember glow, no back button

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function SplashScreen() {
  const router = useRouter();
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
    <ScreenWrapper showGlow={true} centered={true} scrollable={false}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.title}>riverb</Text>
        <Text style={styles.subtitle}>your voice, echoed back.</Text>
        
        <Pressable style={styles.button} onPress={() => router.push('/(onboarding)/intro')}>
          <Text style={styles.buttonText}>begin →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={0} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.splash,  // 67.2dp
    color: Colors.ember,            // #D4A574
    letterSpacing: getLetterSpacing(Fonts.sizes.splash, Fonts.letterSpacing.tight),
    textAlign: 'center',
    // Dual-layer text shadow for ember glow
    textShadowColor: 'rgba(212, 165, 116, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 70,
    // Note: React Native only supports single text-shadow
    // The second layer (140dp blur) is approximated by the AmbientGlow component
  },
  subtitle: {
    fontFamily: Fonts.displayItalic,
    fontSize: 14.4,                 // 0.9rem
    color: Colors.textDim,          // #444444
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 32,
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.button,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(Fonts.sizes.button, Fonts.letterSpacing.button),
    textTransform: 'lowercase',
  },
});