// S3 - Privacy Screen
// Verbatim copy, "encrypted" in #E8E8E8 weight 400

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { Spacing } from '../../src/constants/Spacing';
import { animateScreenEntry } from '../../src/utils/animations';

export default function PrivacyScreen() {
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
        <Text style={styles.heading}>Your words stay yours.</Text>
        
        <Text style={styles.lead}>
          No social features.{"\n"}
          No audience. No ads.{"\n\n"}
          Your entries are <Text style={styles.leadEmphasis}>encrypted</Text>{"\n"}
          and never shared.{"\n\n"}
          This is a journal,{"\n"}
          not a platform.
        </Text>
        
        <Pressable style={styles.button} onPress={() => router.push('/(onboarding)/name')}>
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={2} total={19} />
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
    fontSize: Fonts.sizes.h1,       // 28.8dp
    lineHeight: Fonts.sizes.h1 * Fonts.lineHeights.tight,  // 1.2
    color: Colors.text,             // #E8E8E8
    textAlign: 'center',
    maxWidth: Spacing.maxWidthH1,   // 290dp
    marginBottom: 19.2,
  },
  lead: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.lead,
    fontWeight: '300',
    lineHeight: Fonts.sizes.lead * Fonts.lineHeights.loose,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: Spacing.maxWidthLead,
  },
  leadEmphasis: {
    color: Colors.text,
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