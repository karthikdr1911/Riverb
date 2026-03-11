// S4 - Name Input Screen
// Underline-only TextInput, stores name in OnboardingContext

import React, { useEffect, useState } from 'react';
import { Text, TextInput, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { Spacing } from '../../src/constants/Spacing';
import { animateScreenEntry } from '../../src/utils/animations';

export default function NameScreen() {
  const router = useRouter();
  const { userName, setUserName } = useOnboarding();
  const [localName, setLocalName] = useState(userName);
  const [isFocused, setIsFocused] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleContinue = () => {
    setUserName(localName);
    router.push('/(onboarding)/weather');
  };

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.heading}>
          What should{"\n"}
          we call you?
        </Text>
        
        <Text style={styles.caption}>just a first name is fine.</Text>
        
        {/* Underline-only input using View wrapper */}
        <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            value={localName}
            onChangeText={setLocalName}
            placeholder="your name"
            placeholderTextColor={Colors.textDim}
            maxLength={24}
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor={Colors.ember}
          />
        </View>
        
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={3} total={19} />
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
  caption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(Fonts.sizes.caption, Fonts.letterSpacing.medium),
    marginTop: 9.6,
  },
  inputWrapper: {
    width: 210,
    marginTop: 27.2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,  // #2C2C2C
  },
  inputWrapperFocused: {
    borderBottomColor: Colors.ember,    // #D4A574 on focus
  },
  input: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.nameInput,    // 26.4dp
    fontWeight: '300',
    color: Colors.ember,                 // #D4A574 - typed text in ember gold
    textAlign: 'center',
    paddingVertical: 6.4,
    paddingHorizontal: 3.2,
    paddingBottom: 8.8,
  },
  button: {
    marginTop: 28.8,
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