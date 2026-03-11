// S2 - Intro Screen
// Verbatim copy from flow spec, "clearer than you said it." in #E8E8E8 weight 400

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function IntroScreen() {
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
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.lead}>
          You speak.{"\n\n"}
          We reflect it back —{"\n"}
          <Text style={styles.leadEmphasis}>clearer than you said it.</Text>
          {"\n\n"}
          Over time, your entries{"\n"}
          become a story.{"\n"}
          And you're the protagonist.
        </Text>
        
        <Pressable style={styles.button} onPress={() => router.push('/(onboarding)/privacy')}>
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={1} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 300,
  },
  lead: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.lead,     // 17.6dp (1.1rem)
    fontWeight: '300',
    lineHeight: Fonts.sizes.lead * Fonts.lineHeights.loose,  // 1.75
    color: Colors.textMuted,        // #888888
    textAlign: 'center',
  },
  leadEmphasis: {
    color: Colors.text,             // #E8E8E8
    fontFamily: Fonts.displayRegular,
    fontWeight: '400',
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