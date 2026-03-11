// S16 - Afterglow Same
// Loops back to S7 (first-prompt)

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function AfterglowSameScreen() {
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
          That's okay.{"\n\n"}
          Not everything shifts{"\n"}
          in one sitting.
        </Text>
        
        <Text style={styles.caption}>want to say it out loud again?</Text>
        
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/first-prompt')}
        >
          <Text style={styles.buttonText}>say it out loud →</Text>
        </Pressable>
        
        <Pressable
          style={styles.ghostButton}
          onPress={() => router.push('/(onboarding)/afterglow-lighter')}
        >
          <Text style={styles.ghostButtonText}>continue to journal</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={15} total={19} />
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
    marginBottom: 28,
  },
  caption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
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