// S9 - Processing Screen
// "Listening..." breathing animation, awaits real API promise, routes on result

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding, FALLBACK_MIRROR_MOMENT } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

const BREATHING_DURATION = 2200;
const MIN_DISPLAY_MS = 3000;

export default function ProcessingScreen() {
  const router = useRouter();
  const { getPendingEntryPromise, setMirrorMoment, setStoryScene } = useOnboarding();
  const breathingOpacity = useRef(new RNAnimated.Value(0.25)).current;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);

    const breathingAnimation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(breathingOpacity, {
          toValue: 1,
          duration: BREATHING_DURATION / 2,
          useNativeDriver: true,
        }),
        RNAnimated.timing(breathingOpacity, {
          toValue: 0.25,
          duration: BREATHING_DURATION / 2,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();

    const processEntry = async () => {
      const promise = getPendingEntryPromise();
      const delay = new Promise<void>((resolve) => setTimeout(resolve, MIN_DISPLAY_MS));

      try {
        const [apiResult] = await Promise.all([
          promise ? promise.catch(() => null) : Promise.resolve(null),
          delay,
        ]);

        if (apiResult?.safety_mode) {
          router.replace('/safety');
          return;
        }

        if (apiResult?.mirror_moment) {
          setMirrorMoment(apiResult.mirror_moment);
          setStoryScene(apiResult.story_scene || null);
        } else {
          setMirrorMoment(FALLBACK_MIRROR_MOMENT);
          setStoryScene(null);
        }

        router.push('/(onboarding)/mirror-moment');
      } catch (error) {
        console.error('[Riverb Error] Processing failed:', error);
        setMirrorMoment(FALLBACK_MIRROR_MOMENT);
        setStoryScene(null);
        router.push('/(onboarding)/mirror-moment');
      }
    };

    processEntry();

    return () => {
      breathingAnimation.stop();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenWrapper showGlow={true} centered={true} scrollable={false}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <RNAnimated.Text style={[styles.text, { opacity: breathingOpacity }]}>
          Listening...
        </RNAnimated.Text>
      </Animated.View>
      <ProgressDots currentIndex={8} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.displayItalic,
    fontSize: Fonts.sizes.processing,
    fontWeight: '300',
    fontStyle: 'italic',
    color: Colors.textDim,
  },
});
