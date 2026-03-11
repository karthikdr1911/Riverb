// S15 - Afterglow Lighter (Terminal)
// End of onboarding flow

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function AfterglowLighterScreen() {
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
          That's good.{"\n"}
          Sometimes that's all{"\n"}
          you need — to feel{"\n"}
          a little lighter.
        </Text>
        
        <Text style={styles.caption}>Your entry is saved.</Text>
        
        <Pressable
          style={styles.button}
          onPress={() => {
            // Onboarding complete — no home screen yet
            console.log('Onboarding complete');
          }}
        >
          <Text style={styles.buttonText}>start journaling →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={14} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  response: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.afterglowResponse,  // 16.8dp (1.05rem)
    fontWeight: '300',
    lineHeight: Fonts.sizes.afterglowResponse * Fonts.lineHeights.relaxed,  // 1.65
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
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
});