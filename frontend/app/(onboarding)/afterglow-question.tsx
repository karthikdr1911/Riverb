// S14 - Afterglow Question
// Three options: Lighter, Same, Heavier

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function AfterglowQuestionScreen() {
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
        <Text style={styles.heading}>
          How do you feel{"\n"}
          right now?
        </Text>
        
        <View style={styles.options}>
          <Pressable
            style={styles.option}
            onPress={() => router.push('/(onboarding)/afterglow-lighter')}
          >
            <Text style={styles.optionIcon}>↑</Text>
            <Text style={styles.optionText}>lighter</Text>
          </Pressable>
          
          <Pressable
            style={styles.option}
            onPress={() => router.push('/(onboarding)/afterglow-same')}
          >
            <Text style={styles.optionIcon}>→</Text>
            <Text style={styles.optionText}>about the same</Text>
          </Pressable>
          
          <Pressable
            style={styles.option}
            onPress={() => router.push('/(onboarding)/afterglow-heavier')}
          >
            <Text style={styles.optionIcon}>↓</Text>
            <Text style={styles.optionText}>heavier</Text>
          </Pressable>
        </View>
      </Animated.View>
      
      <ProgressDots currentIndex={13} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.display,
    fontWeight: '300',
    fontSize: Fonts.sizes.h1Reduced,  // 24.8dp (1.55rem)
    lineHeight: Fonts.sizes.h1Reduced * Fonts.lineHeights.tight,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 260,
  },
  options: {
    gap: 16,
    width: '100%',
    maxWidth: 260,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
    gap: 12,
  },
  optionIcon: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.agIcon,  // 12.8dp (0.8rem)
    color: Colors.textDim,
  },
  optionText: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.afterglowOption,  // 11.52dp (0.72rem)
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(Fonts.sizes.afterglowOption, Fonts.letterSpacing.widest),
    textTransform: 'lowercase',
  },
});