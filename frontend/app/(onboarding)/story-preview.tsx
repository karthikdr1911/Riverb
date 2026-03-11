// S11 - Story Preview Screen
// Displays real AI-generated story scene prose from onboarding context

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

const FALLBACK_SCENE = "The evening had that quality of held breath.\n\nSomething about saying it aloud had changed the shape of it. Not smaller, exactly. Just clearer.\n\nThe fog was thinning enough to see the road was still there.";

export default function StoryPreviewScreen() {
  const router = useRouter();
  const { userName, storyScene } = useOnboarding();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const paragraphs = (storyScene || FALLBACK_SCENE)
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const displayName = userName || 'You';
  let nameHighlighted = false;

  const renderParagraph = (text: string, index: number) => {
    // Find and highlight first occurrence of user's name
    if (!nameHighlighted && displayName && text.includes(displayName)) {
      nameHighlighted = true;
      const parts = text.split(displayName);
      return (
        <Text key={index} style={styles.paragraph}>
          {parts[0]}
          <Text style={styles.name}>{displayName}</Text>
          {parts.slice(1).join(displayName)}
        </Text>
      );
    }
    return <Text key={index} style={styles.paragraph}>{text}</Text>;
  };

  return (
    <ScreenWrapper showGlow={true} centered={false} scrollable={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      <Text style={styles.wordmark}>your story</Text>
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.chapterTag}>chapter 1</Text>
        
        <View style={styles.prose}>
          {paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
        </View>
        
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/add-character')}
        >
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={10} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    fontFamily: Fonts.display,
    fontSize: 11.2,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(11.2, 0.18),
    zIndex: 10,
  },
  container: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 30,
  },
  chapterTag: {
    fontFamily: Fonts.ui,
    fontSize: 9.3,
    color: Colors.ember,
    letterSpacing: getLetterSpacing(9.3, 0.16),
    textTransform: 'lowercase',
    marginBottom: 18,
  },
  prose: {
    maxWidth: 295,
    gap: 14,
    marginBottom: 32,
  },
  paragraph: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '300',
    color: Colors.textMuted,
    lineHeight: 14 * 1.88,
    textAlign: 'left',
  },
  name: {
    fontFamily: Fonts.displayItalic,
    color: Colors.ember,
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
});
