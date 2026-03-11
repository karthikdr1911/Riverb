// S7 - First Prompt Screen
// Rotating suggestions, record button, starts audio recording on tap

import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import AnimatedReanimated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { RecordButton } from '../../src/components/RecordButton';
import { RotatingSuggestions, SUGGESTION_ROTATION_INTERVAL, SUGGESTION_FADE_DURATION, SUGGESTION_START_DELAY } from '../../src/constants/Suggestions';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function FirstPromptScreen() {
  const router = useRouter();
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const suggestionOpacity = useRef(new Animated.Value(1)).current;
  const rotationInterval = useRef<NodeJS.Timeout | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Rotating suggestions logic
  useFocusEffect(
    React.useCallback(() => {
      // Reset to index 0 on entry
      setCurrentSuggestionIndex(0);
      suggestionOpacity.setValue(0);

      // Start rotation after 400ms delay
      const startTimeout = setTimeout(() => {
        // Fade in first suggestion
        Animated.timing(suggestionOpacity, {
          toValue: 1,
          duration: SUGGESTION_FADE_DURATION,
          useNativeDriver: true,
        }).start();

        // Start rotation cycle
        rotationInterval.current = setInterval(() => {
          // Fade out
          Animated.timing(suggestionOpacity, {
            toValue: 0,
            duration: SUGGESTION_FADE_DURATION,
            useNativeDriver: true,
          }).start(() => {
            // Change suggestion
            setCurrentSuggestionIndex((prev) => (prev + 1) % RotatingSuggestions.length);
            // Fade in
            Animated.timing(suggestionOpacity, {
              toValue: 1,
              duration: SUGGESTION_FADE_DURATION,
              useNativeDriver: true,
            }).start();
          });
        }, SUGGESTION_ROTATION_INTERVAL);
      }, SUGGESTION_START_DELAY);

      return () => {
        // Stop rotation on leave
        if (rotationInterval.current) {
          clearInterval(rotationInterval.current);
        }
        clearTimeout(startTimeout);
      };
    }, [])
  );

  const handleRecordPress = () => {
    // Navigate to recording screen and start recording
    router.push('/(onboarding)/recording');
  };

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      {/* Topbar wordmark */}
      <Text style={styles.wordmark}>riverb</Text>
      
      <AnimatedReanimated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.heading}>
          What's been on your{"\n"}
          mind lately?
        </Text>
        
        <Text style={styles.caption}>hit record. a minute is enough.</Text>
        
        <View style={styles.recordContainer}>
          <RecordButton isRecording={false} onPress={handleRecordPress} />
          <Text style={styles.tapCaption}>tap to record</Text>
        </View>
        
        {/* Rotating suggestions */}
        <Animated.Text style={[styles.suggestion, { opacity: suggestionOpacity }]}>
          {RotatingSuggestions[currentSuggestionIndex]}
        </Animated.Text>
      </AnimatedReanimated.View>
      
      <ProgressDots currentIndex={6} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.wordmark,  // 11.2dp (0.7rem)
    color: Colors.textDim,            // #444444
    letterSpacing: getLetterSpacing(Fonts.sizes.wordmark, Fonts.letterSpacing.wordmark),
    zIndex: 10,
  },
  container: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.display,
    fontWeight: '300',
    fontSize: Fonts.sizes.h1,
    lineHeight: Fonts.sizes.h1 * Fonts.lineHeights.tight,
    color: Colors.text,
    textAlign: 'center',
    maxWidth: 290,
  },
  caption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
    marginTop: 8,
  },
  recordContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 9.6,
  },
  tapCaption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
    textTransform: 'lowercase',
  },
  suggestion: {
    fontFamily: Fonts.displayItalic,
    fontSize: Fonts.sizes.suggestion,  // 13.12dp (0.82rem)
    fontStyle: 'italic',
    color: Colors.textDim,              // #444444
    textAlign: 'center',
    marginTop: 32,
    maxWidth: 260,
    minHeight: 40,
  },
});