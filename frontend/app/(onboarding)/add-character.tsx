// S12 - Add Character Screen
// Uses character_refs from mirror moment; skips if none detected
// POSTs to /api/characters when user saves a character

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
import { animateScreenEntry } from '../../src/utils/animations';

const RELATIONSHIP_OPTIONS = ['friend', 'partner', 'family', 'colleague'];

export default function AddCharacterScreen() {
  const router = useRouter();
  const { mirrorMoment, userId } = useOnboarding();
  const characterRefs = mirrorMoment?.character_refs ?? [];
  const [name, setName] = useState(characterRefs[0] || '');
  const [relationship, setRelationship] = useState<string | null>(null);
  const [oneLine, setOneLine] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
    // Auto-skip if no character refs detected
    if (characterRefs.length === 0) {
      router.replace('/(onboarding)/ready');
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleAddToStory = async () => {
    if (!name.trim()) {
      router.push('/(onboarding)/ready');
      return;
    }
    try {
      const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
      await fetch(`${API_URL}/api/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: name.trim(),
          relationship: relationship || null,
          one_line_description: oneLine.trim() || null,
        }),
      });
    } catch (error) {
      console.error('[Riverb Error] Save character failed:', error);
    }
    router.push('/(onboarding)/ready');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/ready');
  };

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.heading}>
          Want to add someone{"\n"}
          to your story?
        </Text>
        
        <Text style={styles.subtext}>
          People you mention will appear{"\n"}
          as characters in your narrative.
        </Text>
        
        <View style={styles.form}>
          {/* Name field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>name</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'name' && styles.inputWrapperFocused,
            ]}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="their name"
                placeholderTextColor={Colors.textDim}
                maxLength={50}
                autoCorrect={false}
                spellCheck={false}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                selectionColor={Colors.ember}
              />
            </View>
          </View>
          
          {/* Relationship tags */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>relationship</Text>
            <View style={styles.tagsContainer}>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.tag,
                    relationship === option && styles.tagActive,
                  ]}
                  onPress={() => setRelationship(option)}
                >
                  <Text style={[
                    styles.tagText,
                    relationship === option && styles.tagTextActive,
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* One-line description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>in one line</Text>
            <View style={[
              styles.inputWrapper,
              focusedField === 'oneLine' && styles.inputWrapperFocused,
            ]}>
              <TextInput
                style={styles.input}
                value={oneLine}
                onChangeText={setOneLine}
                placeholder="how would you describe them?"
                placeholderTextColor={Colors.textDim}
                maxLength={120}
                autoCorrect={false}
                spellCheck={false}
                onFocus={() => setFocusedField('oneLine')}
                onBlur={() => setFocusedField(null)}
                selectionColor={Colors.ember}
              />
            </View>
          </View>
        </View>
        
        <Pressable style={styles.button} onPress={handleAddToStory}>
          <Text style={styles.buttonText}>
            add {name ? name : 'to story'} →
          </Text>
        </Pressable>
        
        <Pressable style={styles.ghostButton} onPress={handleSkip}>
          <Text style={styles.ghostButtonText}>skip for now</Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={11} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  heading: {
    fontFamily: Fonts.display,
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: Colors.text,
    textAlign: 'center',
    maxWidth: 290,
  },
  subtext: {
    fontFamily: Fonts.display,
    fontSize: 12.8,
    fontWeight: '300',
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 12.8 * 1.65,
    marginTop: 8.8,
    maxWidth: 270,
  },
  form: { width: '100%', maxWidth: 295, marginTop: 21, gap: 18 },
  fieldGroup: { width: '100%' },
  label: {
    fontFamily: Fonts.ui,
    fontSize: 9.3,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(9.3, 0.12),
    textTransform: 'lowercase',
    marginBottom: 7,
  },
  inputWrapper: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  inputWrapperFocused: { borderBottomColor: Colors.ember },
  input: {
    fontFamily: Fonts.ui,
    fontSize: 13.44,
    color: Colors.text,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 2 },
  tagActive: { borderColor: Colors.ember },
  tagText: {
    fontFamily: Fonts.ui,
    fontSize: 9.92,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(9.92, 0.08),
    textTransform: 'lowercase',
  },
  tagTextActive: { color: Colors.ember },
  button: {
    marginTop: 24,
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
  ghostButton: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 16 },
  ghostButtonText: {
    fontFamily: Fonts.ui,
    fontSize: 10.4,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(10.4, 0.08),
    textTransform: 'lowercase',
  },
});
