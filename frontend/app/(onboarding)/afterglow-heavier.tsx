// S17 - Afterglow Heavier
// Loops back to S5 (weather)

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function AfterglowHeavierScreen() {
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
        <Text style={styles.response}>
          Okay.{"\n\n"}
          Let's try again —{"\n"}
          slower this time.{"\n\n"}
          Take a breath.{"\n"}
          Then speak.
        </Text>
        
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/weather')}
        >
          <Text style={styles.buttonText}>check in again →</Text>
        </Pressable>
        
        <Pressable
          style={styles.ghostButton}
          onPress={() => router.push('/(onboarding)/afterglow-lighter')}
        >
          <Text style={styles.ghostButtonText}>continue to journal</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={16} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  response: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.afterglowResponse,
    fontWeight: '300',
    lineHeight: Fonts.sizes.afterglowResponse * Fonts.lineHeights.relaxed,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
  ghostButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ghostButtonText: {
    fontFamily: Fonts.ui,
    fontSize: 10.5,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(10.5, 0.1),
    textTransform: 'lowercase',
  },
});