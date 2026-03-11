// S5 - Internal Weather Slider
// Custom slider with gradient track and dynamic word display

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import AnimatedReanimated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { Spacing } from '../../src/constants/Spacing';
import { animateScreenEntry } from '../../src/utils/animations';

const WEATHER_WORDS = [
  { range: [0, 10], text: "still. rooted. barely a breeze." },
  { range: [11, 25], text: "quiet inside. settled." },
  { range: [26, 40], text: "mostly calm, a little stirring." },
  { range: [41, 60], text: "somewhere in between." },
  { range: [61, 75], text: "thoughts humming, edges lit." },
  { range: [76, 88], text: "scattered, picking up speed." },
  { range: [89, 100], text: "electric. a lot is moving." },
];

const getWeatherWord = (value: number): string => {
  const word = WEATHER_WORDS.find(w => value >= w.range[0] && value <= w.range[1]);
  return word ? word.text : WEATHER_WORDS[3].text;
};

export default function WeatherScreen() {
  const router = useRouter();
  const { weatherValue, setWeatherValue } = useOnboarding();
  const [sliderValue, setSliderValue] = useState(weatherValue);
  const [currentWord, setCurrentWord] = useState(getWeatherWord(weatherValue));
  const wordOpacity = new Animated.Value(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    const newWord = getWeatherWord(value);
    if (newWord !== currentWord) {
      // Fade out, change word, fade in (160ms)
      Animated.sequence([
        Animated.timing(wordOpacity, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentWord(newWord);
    }
  };

  const handleContinue = () => {
    setWeatherValue(sliderValue);
    router.push('/(onboarding)/energy');
  };

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      <AnimatedReanimated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.heading}>
          What's your internal{"\n"}
          weather right now?
        </Text>
        
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>peaceful</Text>
            <Text style={styles.sliderLabel}>wired</Text>
          </View>
          
          {/* Slider with glow effect */}
          <View style={styles.sliderWrapper}>
            {/* Glow behind thumb - positioned based on slider value */}
            <View
              style={[
                styles.thumbGlow,
                {
                  left: `${sliderValue}%`,
                },
              ]}
            />
            
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={sliderValue}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="rgba(212,165,116,0.35)"
              maximumTrackTintColor={Colors.border}
              thumbTintColor={Colors.ember}  // #D4A574 - visible gold thumb
            />
          </View>
          
          <Animated.Text style={[styles.weatherWord, { opacity: wordOpacity }]}>
            {currentWord}
          </Animated.Text>
        </View>
        
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </AnimatedReanimated.View>
      
      <ProgressDots currentIndex={4} total={19} />
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
    fontSize: Fonts.sizes.h1,
    lineHeight: Fonts.sizes.h1 * Fonts.lineHeights.tight,
    color: Colors.text,
    textAlign: 'center',
    maxWidth: Spacing.maxWidthH1,
  },
  sliderContainer: {
    width: 295,
    marginTop: 32,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.sliderLabel,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(Fonts.sizes.sliderLabel, Fonts.letterSpacing.wider),
    textTransform: 'lowercase',
  },
  sliderWrapper: {
    position: 'relative',
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  thumbGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212,165,116,0.09)',  // Outer glow ring
    marginLeft: -18,  // Center the glow on thumb
    zIndex: 0,
  },
  slider: {
    width: '100%',
    height: 40,
    zIndex: 1,
  },
  weatherWord: {
    fontFamily: Fonts.displayItalic,
    fontSize: Fonts.sizes.weatherWord,  // 14.72dp
    fontStyle: 'italic',
    color: Colors.ember,
    marginTop: 20.8,
    minHeight: 20.8,
    textAlign: 'center',
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